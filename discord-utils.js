import { verifyKey } from "discord-interactions";
import { DiscordRequest } from "./fetch.js";

function convertGuildCommandsEndpoint(appId, guildId) {
  return `applications/${appId}/guilds/${guildId}/commands`;
}

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf) {
    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send("Bad request signature");
      throw new Error("Bad request signature");
    }
  };
}

export async function VerifyInstalledCommands(appId, guildId, commands) {
  if (guildId === "" || appId === "") return;
  commands.forEach((c) => VerifyInstalledCommand(appId, guildId, c));
}

async function VerifyInstalledCommand(appId, guildId, command) {
  const endpoint = convertGuildCommandsEndpoint(appId, guildId);

  try {
    const res = await DiscordRequest(endpoint, { method: "GET" });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c.name);
      // This is just matching on the name, so it's not good for updates
      // Todo verify checksum or something
      if (!installedNames.includes(command.name)) {
        console.log(`Installing "${command.name}"`);
        InstallCommand(appId, guildId, command);
      } else {
        console.log(`"${command.name}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export async function InstallCommand(appId, guildId, command) {
  const endpoint = convertGuildCommandsEndpoint(appId, guildId);
  // install command
  try {
    await DiscordRequest(endpoint, { method: "POST", body: command });
  } catch (err) {
    console.error(err);
  }
}
