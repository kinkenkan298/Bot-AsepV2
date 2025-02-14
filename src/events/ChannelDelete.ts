import ChatAIModel from "#asep/structures/schemas/user/ChatAIModel.js";
import { createEvent } from "seyfert";

export default createEvent({
  data: { name: "channelDelete" },
  run: async (channel, client) => {
    const channelId = channel.id;
    const guildId = channel.guildId;
    const findChannel = await ChatAIModel.findOne({ guildId });
    if (!findChannel) return;
    for (const chnel of findChannel.channels) {
      if (chnel.channelId === channelId) {
        await ChatAIModel.findOneAndUpdate(
          { guildId },
          { $pull: { channels: { channelId } } },
        );
        return;
      }
    }
    return;
  },
});
