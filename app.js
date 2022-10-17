import "dotenv/config"; // will parse .env-file in project root
import express from "express";
import { VerifyDiscordRequest, VerifyInstalledCommands } from "./discord-utils.js";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import { SHOW_STEAM_DEALS, SHOW_STEAM_FREEBIES } from "./commands.js";

const PORT = process.env.PORT || 3000;

// todo
const app = express();
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post("/interactions", async function (req, res) {
  const { interactionType, interactionId, interactionData } = req.body;
  switch (interactionType) {
    /**
     * Handle verification requests
     */
    case InteractionType.PING:
      return res.send({ type: InteractionResponseType.PONG });
    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    case InteractionType.APPLICATION_COMMAND:
      console.log("slash-command: ", interactionType, interactionId, interactionData);
      break;
    /**
     * Handle requests from interactive components
     * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
     */
    case InteractionType.MESSAGE_COMPONENT:
      break;
    default:
      break;
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);

  // Check if guild commands from commands.js are installed (if not, install them)
  VerifyInstalledCommands(process.env.APP_ID, process.env.GUILD_ID, [
    SHOW_STEAM_DEALS,
    SHOW_STEAM_FREEBIES,
  ]);
});