import "dotenv/config"; // will use .env file from root dir

import express from "express";
import {
  InteractionType,
  InteractionResponseType
} from "discord-interactions";

import { discordResponse, verifyDiscordRequest } from "./discord-utils.js";
import { VerifyGuildCommands } from "./guild-commands.js";
import {
  FREE,
  SHOW_DEALS,
  TEST_COMMAND,
  COMMAND_NAMES
} from "./commands.js";
import { gatherSteamDeals } from "./steam.js";
import { convertPrice } from "./utils.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json(
  { verify: verifyDiscordRequest(process.env.PUBLIC_KEY) } // express middleware for verification
));

app.post("/interactions", async function (req, res) {
  const { type, id, data } = req.body;
  console.log(`interaction: ${id}`);
  console.log(data);

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;
    const platformError = "Something went wrong!\nThe chosen platform is unknown, please chose one of the following;\n'steam', 'gog' or 'epic'.";

    /**
     * Command TEST
     */
    if (name === COMMAND_NAMES.TEST) {
      return discordResponse(res, "hello world");
    }

    /**
     * Command DEALS
     */
    if (name === COMMAND_NAMES.DEALS) {
      const platform = options[0]?.value.trim().toLocaleLowerCase();
      if (!platform) {
        return discordResponse(res, platformError);
      }

      if (platform.includes("steam")) {
        const games = await gatherSteamDeals();

        let content = "Current deals \n\n";
        games.forEach((g) => {
          const isoCode = g.currency;
          content = content.concat(`${g.name} \n`);
          content = content.concat(`-${g.discount_percent}% ${convertPrice(isoCode, g.final_price)} \n`);
          content = content.concat(`Usual price ${convertPrice(isoCode, g.original_price)} \n`);
          content = content.concat(`${g.store_url} \n`);
          content = content.concat("\n");
        });

        return discordResponse(res, content);
      }

      if (platform.includes("gog") || platform.includes("good old games")) {
        // todo
        return discordResponse(res, "Coming soon!");
      }

      if (platform.includes("epic") || platform.includes("unreal")) {
        // todo
        return discordResponse(res, "Coming soon!");
      }

      return discordResponse(res, platformError);
    }

    /**
     * Command FREE
     */
    if (name === COMMAND_NAMES.FREE) {
      console.log(COMMAND_NAMES.FREE);
      // todo
      return discordResponse(res, "Coming soon!");
    }
  }

  /**
   * Handle requests from interactive components
   * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    // custom_id set in payload when sending message component
    // const componentId = data.custom_id;
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);

  // Check if guild commands from commands.js are installed (if not, install them)
  VerifyGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    TEST_COMMAND,
    SHOW_DEALS,
    FREE,
  ]);
});
