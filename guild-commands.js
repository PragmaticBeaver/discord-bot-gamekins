import { discordRequest } from "./discord-utils.js";

export async function VerifyGuildCommands(appId, guildId, commands) {
  if (guildId === "" || appId === "") return;

  commands.forEach((c) => VerifyGuildCommand(appId, guildId, c));
}

function buildGuildCommandsEndpoint(appId, guildId) {
  return `applications/${appId}/guilds/${guildId}/commands`;
}

async function VerifyGuildCommand(appId, guildId, command) {
  const endpoint = buildGuildCommandsEndpoint(appId, guildId);

  try {
    const res = await discordRequest(endpoint, { method: "GET" });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c["name"]);
      // This is just matching on the name, so it's not good for updates
      // todo use hash
      if (!installedNames.includes(command["name"])) {
        console.log(`Installing "${command["name"]}"`);
        InstallGuildCommand(appId, guildId, command);
      } else {
        console.log(`"${command["name"]}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function InstallGuildCommand(appId, guildId, command) {
  const endpoint = buildGuildCommandsEndpoint(appId, guildId);

  try {
    await discordRequest(endpoint, { method: "POST", body: command });
  } catch (err) {
    console.error(err);
  }
}