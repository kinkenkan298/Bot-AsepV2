import AutoresponModel from "#asep/schemas/guilds/AutoresponModel.js";
import ChatAIModel from "#asep/structures/schemas/user/ChatAIModel.js";
import { Message, UsingClient } from "seyfert";

export async function AutoresponListener(
  client: UsingClient,
  message: Message,
) {
  const { guildId, content, channelId } = message;
  const msg = content.toLowerCase();

  try {
    const fetchData = await AutoresponModel.findOne({ guildId });
    const findChannel = await ChatAIModel.findOne({ guildId })
    if (!fetchData || !findChannel || findChannel.channels.length === 0) return;
    for (const ChatChannel of findChannel.channels) {
      if (ChatChannel.channelId !== channelId) {
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
