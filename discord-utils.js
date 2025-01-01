import "dotenv/config";

import { InteractionResponseType } from "discord-interactions";
import fetch from "node-fetch";
import nacl from "tweetnacl";

// will use .env file from root dir

export async function verifyRequest(req, res, _next) {
  const clientKey = process.env.PUBLIC_KEY;
  const signature = req.get("X-Signature-Ed25519");
  const timestamp = req.get("X-Signature-Timestamp");
  const body = JSON.stringify(req.body); // expected to be a string, not raw bytes

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, "hex"),
    Buffer.from(clientKey, "hex")
  );
  return isVerified;
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

export function sendDiscordResponse(res, content) {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content },
  });
}
