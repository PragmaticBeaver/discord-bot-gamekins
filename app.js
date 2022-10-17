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
  TEST_COMMAND
} from "./commands.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;
  console.log(`interaction: ${type, id, data}`);

  /**
   * Handle verification requests
   */
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
    if (name === "test") {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: "hello world",
        },
      });
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
