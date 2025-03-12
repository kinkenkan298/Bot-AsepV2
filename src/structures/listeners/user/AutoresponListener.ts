import AutoresponModel from "#asep/schemas/guilds/AutoresponModel.js";
import ChatAIModel from "#asep/structures/schemas/user/ChatAIModel.js";
import type { Message, UsingClient } from "seyfert";

export async function AutoresponListener(
  client: UsingClient,
  message: Message,
) {
  const { guildId, content, channelId } = message;
  const msg = content.toLowerCase();

  try {
    const fetchData = await AutoresponModel.findOne({ guildId });
    const findChannel = await ChatAIModel.findOne({ guildId });
    let channels: string[] = [];
    if (findChannel && findChannel.channels) {
      for (const channel of findChannel.channels) {
        channels.push(channel.channelId);
      }
    }
    if (!channels.includes(channelId)) {
      if (fetchData) {
        for (const data of fetchData.autorespon) {
          const { pesan, balesan } = data;
          if (msg === pesan) message.reply({ content: balesan });
        }
      }
    }
  } catch (e) {
    client.logger.error(e);
  }
}
