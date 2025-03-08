import { ComponentCommand, ComponentContext } from "seyfert";
import ChatAIModel from "#asep/structures/schemas/user/ChatAIModel.js";
import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";

export default class DeleteChatAIComponent extends ComponentCommand {
  componentType = "Button" as const;
  override filter(ctx: ComponentContext<typeof this.componentType>) {
    return ctx.customId === "delete-channel-ai";
  }
  override async run(ctx: ComponentContext<typeof this.componentType>) {
    await ctx.deferReply();
    const { client, guildId, channelId } = ctx;
    const findChatAi = await ChatAIModel.findOne({ guildId });
    if (!findChatAi) {
      await ctx.editOrReply({
        content: "Category channel belom di set bang!",
      });
      return;
    }
    const authorId = ctx.author.id;
    const channelsAuthor = findChatAi.channels;
    const guildCache = ctx.guild("cache");
    if (channelsAuthor.length !== 0) {
      for (const authorChannel of channelsAuthor) {
        if (authorChannel.authorId === authorId) {
          await ctx.editOrReply({
            embeds: [
              new AsepEmbed(
                {
                  title: "Channel akan segera dihapus dalam 10detik!",
                  description: "Segera tinggalkan channel ini!",
                },
                client,
              ).setType("error"),
            ],
          });
          setTimeout(async () => {
            await guildCache?.channels.delete(channelId);
            await ChatAIModel.findOneAndUpdate(
              { guildId },
              { $pull: { channels: { authorId } } },
            );
          }, 10 * 1000);
          return;
        }
      }
    }
    await ctx.editOrReply({
      embeds: [
        new AsepEmbed(
          {
            title: "Kamu bukan pembuat channel ini!",
            description: "Channel hanya bisa dihapus oleh yang membuat!!",
          },
          client,
        ).setType("error"),
      ],
    });
  }
}
