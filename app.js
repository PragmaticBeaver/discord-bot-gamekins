import "dotenv/config";

import { COMMAND_NAMES, FREE, SHOW_DEALS, TEST_COMMAND } from "./commands.js";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import { gatherSteamDeals, gatherSteamFreebies } from "./steam.js";
import { sendDiscordResponse, verifyRequest } from "./discord-utils.js";

import { buildChatOutput } from "./utils.js";
import express from "express";
import { gatherEpicGamesFreebies } from "./epicGamesStore.js";
import { verifyGuildCommands } from "./guild-commands.js";

// will use .env file from root dir

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.post("/interactions", async function (req, res) {
  const isVerified = await verifyRequest(req, process.env.PUBLIC_KEY);
  if (!isVerified) {
    return res.status(401).send("Bad request signature");
  }

  const { type, id, data } = req.body;
  console.log(`interaction: ${id} - command ${data?.name || type}`);
  if (data?.options) {
    console.log({ options: data.options });
  }

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;
    const platformError =
      "Something went wrong!\nThe chosen platform is unknown, please chose one of the following;\n'steam', 'gog' or 'epic'.";

    /**
     * Command TEST
     */
    if (name === COMMAND_NAMES.TEST) {
      return sendDiscordResponse(res, "hello world");
    }

    /**
     * Command DEALS
     */
    if (name === COMMAND_NAMES.DEALS) {
      const platform = options[0]?.value.trim().toLocaleLowerCase();
      if (!platform) {
        return sendDiscordResponse(res, platformError);
      }

      if (platform.includes("steam")) {
        const games = await gatherSteamDeals();
        if (!games || games.length < 1) {
          return sendDiscordResponse(
            res,
            "No deals found. :disappointed_relieved:"
          );
        }
        const content = buildChatOutput(games, "Current deals");
        return sendDiscordResponse(res, content);
      }

      if (platform.includes("gog") || platform.includes("good old games")) {
        // todo
        return sendDiscordResponse(res, "Coming soon!");
      }

      if (platform.includes("epic") || platform.includes("unreal")) {
        // todo
        return sendDiscordResponse(res, "Coming soon!");
      }

      return sendDiscordResponse(res, platformError);
    }

    /**
     * Command FREE
     */
    if (name === COMMAND_NAMES.FREE) {
      let games = [];

      const freeSteamGames = await gatherSteamFreebies();
      if (freeSteamGames?.length > 0) {
        games = games.concat(freeSteamGames);
      }

      const freeEpicGames = await gatherEpicGamesFreebies();
      console.log({ freeEpicGames });

      if (freeEpicGames?.length > 0) {
        games = games.concat(freeEpicGames);
      }

      console.log(`found ${games.length} freebies`);

      if (games.length < 1) {
        return sendDiscordResponse(
          res,
          "No free games. :disappointed_relieved:"
        );
      }

      const content = buildChatOutput(games, "Freebies");
      return sendDiscordResponse(res, content);
    }
  }

  /**
   * Handle requests from interactive components
   * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  // if (type === InteractionType.MESSAGE_COMPONENT) {
  //   // custom_id set in payload when sending message component
  //   // const componentId = data.custom_id;
  // }
});

app.listen(PORT, () => {
  const appId = process.env.APP_ID;
  const guildId = process.env.GUILD_ID;
  const nodeEnv = process.env.NODE_ENV;

  console.log("Listening on port", PORT);
  console.log({ appId, guildId, nodeEnv });

  // Check if guild commands from commands.js are installed (if not, install them)
  verifyGuildCommands(appId, guildId, nodeEnv, [
    TEST_COMMAND,
    SHOW_DEALS,
    FREE,
  ]);
});
