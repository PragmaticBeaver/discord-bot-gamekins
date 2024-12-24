import "dotenv/config";

// will use .env file from root dir
import { InteractionResponseType, verifyKey } from "discord-interactions";

import fetch from "node-fetch";

export function verifyRequest(clientKey) {
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

export async function discordApiRequest(endpoint, options) {
  const url = "https://discord.com/api/v10/" + endpoint;
  options.body = options.body ? JSON.stringify(options.body) : options.body;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)", // todo
    },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }

  return res;
}

export function createDiscordResponse(res, content) {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content },
  });
}
