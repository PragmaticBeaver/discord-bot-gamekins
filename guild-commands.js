import { discordRequest } from "./discord-utils.js";
import hash from "object-hash";

export async function verifyGuildCommands(appId, guildId, nodeEnv, commands) {
  if (appId === "") return;

  const endpoint = buildGuildCommandsEndpoint(appId, guildId, nodeEnv);
  commands.forEach((c) => verifyGuildCommand(c, endpoint));
}

function buildGuildCommandsEndpoint(appId, guildId, nodeEnv) {
  const globalEndpoint = `applications/${appId}/commands`;
  const guildEndpoint = `applications/${appId}/guilds/${guildId}/commands`;
  const endpoint = nodeEnv === "dev" ? guildEndpoint : globalEndpoint;
  return endpoint;
}

async function verifyGuildCommand(command, endpoint) {
  let data;
  try {
    const res = await discordRequest(endpoint, { method: "GET" });
    data = await res.json();
  } catch (err) {
    console.error(err);
    return;
  }

  let installedCommand;
  data.forEach((cmd) => {
    if (cmd.name === command.name) {
      installedCommand = cmd;
      return;
    }
  });

  const installedCommandHash = calcCommandHash(installedCommand);
  const newCommandHash = calcCommandHash(command);
  if (installedCommandHash !== newCommandHash) {
    console.log(`Installing "${command.name}"`);
    await InstallGuildCommand(command, endpoint);
  } else {
    console.log(`"${command.name}" command already installed`);
  }
}

async function InstallGuildCommand(command, endpoint) {
  try {
    await discordRequest(endpoint, { method: "POST", body: command });
  } catch (err) {
    console.error(err);
  }
}

function calcCommandHash(command) {
  if (!command) return undefined;

  return hash(command, {
    algorithm: "md5",
    encoding: "base64",
    respectType: false,
    unorderedArrays: true,
    unorderedObjects: true,
    unorderedSets: true,
    excludeKeys: (k) => {
      return (
        k === "id" ||
        k === "application_id" ||
        k === "version" ||
        k === "default_permission" ||
        k === "default_member_permissions" ||
        k === "type" ||
        k === "guild_id"
      );
    },
  });
}
