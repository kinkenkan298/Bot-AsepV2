import AutoresponModel from "#asep/schemas/guilds/AutoresponModel.js";
import { Message, UsingClient } from "seyfert";

export async function AutoresponListener(
  client: UsingClient,
  message: Message,
) {
  const { guildId, content } = message;
  const msg = content.toLowerCase();

  try {
    const fetchData = await AutoresponModel.findOne({ guildId });
    if (!fetchData) return;
    for (const data of fetchData.autorespon) {
      const { pesan, balesan } = data;
      if (msg === pesan) message.reply({ content: balesan });
    }
  } catch (e) {
    client.logger.error(e);
  }
}
