import { discordRequest } from "./discord-utils.js";

export async function VerifyGuildCommands(appId, guildId, nodeEnv, commands) {
  if (appId === "") return;

  const endpoint = buildGuildCommandsEndpoint(appId, guildId, nodeEnv);
  console.log("endpoint", endpoint);
  commands.forEach((c) => VerifyGuildCommand(c, endpoint));
}

function buildGuildCommandsEndpoint(appId, guildId, nodeEnv) {
  const globalEndpoint = `applications/${appId}/commands`;
  const guildEndpoint = `applications/${appId}/guilds/${guildId}/commands`;
  const endpoint = nodeEnv === "dev" ? guildEndpoint : globalEndpoint;
  return endpoint;
}

async function VerifyGuildCommand(command, endpoint) {
  try {
    const res = await discordRequest(endpoint, { method: "GET" });
    const data = await res.json();
    console.log("guild response", data);

    if (data) {
      const installedNames = data.map((c) => c["name"]);
      // This is just matching on the name, so it's not good for updates
      // todo use hash
      if (!installedNames.includes(command["name"])) {
        console.log(`Installing "${command["name"]}"`);
        InstallGuildCommand(command, endpoint);
      } else {
        console.log(`"${command["name"]}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function InstallGuildCommand(command, endpoint) {
  try {
    await discordRequest(endpoint, { method: "POST", body: command });
  } catch (err) {
    console.error(err);
  }
}