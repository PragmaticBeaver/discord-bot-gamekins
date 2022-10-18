import "dotenv/config"; // will use .env file from root dir

import express from "express";
import {
  InteractionType,
  InteractionResponseType
} from "discord-interactions";

import { VerifyDiscordRequest } from "./utils.js";
import { VerifyGuildCommands } from "./guild-commands.js";
import {
  SHOW_STEAM_DEALS,
  SHOW_STEAM_FREEBIES,
  TEST_COMMAND,
  COMMAND_NAMES
} from "./commands.js";
import { gatherSteamDeals } from "./steam.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json(
  { verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) } // express middleware for verification
));

app.post("/interactions", async function (req, res) {
  const { type, id, data } = req.body;
  console.log(`interaction: ${type, id, data}`);

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" guild command
    if (name === COMMAND_NAMES.TEST) {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: "hello world",
        },
      });
    }

    if (name === COMMAND_NAMES.STEAM_DEALS) {
      console.log(COMMAND_NAMES.STEAM_DEALS);
      const games = await gatherSteamDeals();
      console.log(games);
      return res.status(200).send(games);
    }

    if (name === COMMAND_NAMES.STEAM_FREEBIES) {
      console.log(COMMAND_NAMES.STEAM_FREEBIES);
      // todo
      return res.status(200).send();
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
    SHOW_STEAM_DEALS,
    SHOW_STEAM_FREEBIES,
  ]);
});
