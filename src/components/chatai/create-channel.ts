import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import {
  ComponentCommand,
  type ComponentContext,
  ActionRow,
  Button,
  Formatter,
} from "seyfert";
import {
  ButtonStyle,
  ChannelType,
  MessageFlags,
  OverwriteType,
} from "seyfert/lib/types/index.js";
import ChatAIModel from "#asep/structures/schemas/user/ChatAIModel.js";

export default class ChatAIComponent extends ComponentCommand {
  componentType = "Button" as const;

  override filter(ctx: ComponentContext<typeof this.componentType>) {
    return ctx.customId === "chataiasep";
  }
  public override async run(ctx: ComponentContext<typeof this.componentType>) {
    const { client, interaction, guildId } = ctx;
    await ctx.deferReply(true);
    const findChatAi = await ChatAIModel.findOne({ guildId });
    if (!findChatAi) {
      await ctx.editOrReply({
        content: "Category channel belom di set bang!",
      });
      return;
    }
    const categoryId = findChatAi?.category;
    const authorId = ctx.author.id;
    const channelsAuthor = findChatAi.channels;
    const guildCache = ctx.guild("cache");
    if (channelsAuthor.length !== 0) {
      for (const authorChannel of channelsAuthor) {
        if (authorChannel.authorId == authorId) {
          await ctx.editOrReply({
            content: "Channel mu sudah ada! Tolong cek kembali!",
          });
          return;
        }
      }
    }
    const channel = await guildCache?.channels.create({
      name: `asep-ai-${ctx.author.id}`,
      parent_id: categoryId,
      type: ChannelType.GuildText,
      topic: `Asep AI dengan  ${ctx.author.username}`,
      permission_overwrites: [
        {
          id: guildId!,
          deny: "0",
          type: OverwriteType.Member,
        },
        {
          id: interaction.member?.id!,
          allow: "1",
          type: OverwriteType.Member,
        },
      ],
      nsfw: false,
    });

    const channelId = channel?.id;
    const newChatChannel = {
      authorId,
      channelId,
    };
    await ChatAIModel.findOneAndUpdate(
      { guildId, category: categoryId },
      { $push: { channels: newChatChannel } },
    );
    const ButtonDelete = new Button({
      style: ButtonStyle.Danger,
      label: "Hapus chat !",
      custom_id: "delete-channel-ai",
    });
    const btn = new ActionRow<Button>().setComponents([ButtonDelete]);
    await ctx.client.messages.write(channelId!, {
      content: Formatter.userMention(ctx.author.id),
      embeds: [
        new AsepEmbed(
          {
            title: `Hallo ${ctx.author.username}!`,
          },
          client,
        ),
      ],
      components: [btn],
    });
    await ctx.editOrReply({
      content: "Silakan chat asep di channel yang sudah di sediakan!",
      flags: MessageFlags.Ephemeral,
    });
    await ctx.author.write({
      content:
        "Berhasil buat channel pada tanggal: " +
        new Date(Date.now()).toTimeString(),
    });
  }
}
