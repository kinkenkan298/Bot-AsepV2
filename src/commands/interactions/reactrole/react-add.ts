import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import {
  CommandContext,
  createRoleOption,
  createStringOption,
  Declare,
  Options,
  SubCommand,
} from "seyfert";
import ReactRoleModel from "#asep/structures/schemas/guilds/ReactRoleModel.js";

const options = {
  messageid: createStringOption({
    description: "ID Pesan yang ingin ditambahkan Role Reaction!",
    required: true,
  }),
  emoji: createStringOption({
    description: "Emoji buat trigger role",
    required: true,
  }),
  role: createRoleOption({
    description: "Role apa yang akan diberikan nanti!",
    required: true,
  }),
};

@Declare({
  name: "add",
  description: "tambah reaction emoji pada pesan!",
})
@Options(options)
export default class ReactRoleAdd extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();

    const { options, guildId, client, channelId, interaction } = ctx;
    const { messageid, emoji, role } = options;

    let message;
    try {
      message = await client.messages.fetch(messageid, channelId);
    } catch (e) {
      client.logger.error(e);
      await ctx.editOrReply({
        embeds: [
          new AsepEmbed(
            {
              title: "ID Pesan tidak ada di channel ini!",
            },
            client,
          ).setType("error"),
        ],
      });
      return;
    }

    try {
      await message.react(emoji);
    } catch (e) {
      client.logger.error(e);
      await ctx.editOrReply({
        embeds: [
          new AsepEmbed(
            {
              title: "Gagal buat reaction pesan!",
            },
            client,
          ).setType("error"),
        ],
      });
      return;
    }

    let emojiId: string | null;
    const customEmoji = (
      await (await interaction?.fetchGuild())?.emojis.list()
    )?.find((e) => `<:${e.name}:${e.id}>` === emoji || `<a:${e.name}:${e.id}>`);

    emojiId = customEmoji ? customEmoji.id : emoji;

    const reactRoleModel = new ReactRoleModel({
      guildId,
      messageId: message.id,
      roleId: role.id,
      emoji: emojiId,
    });

    try {
      await reactRoleModel.save();
      await ctx.editOrReply({
        embeds: [
          new AsepEmbed(
            {
              title: "Berhasil menambahkan react emoji ke pesan!",
            },
            client,
          ).setType("success"),
        ],
      });
    } catch (e) {
      client.logger.error(e);
      await ctx.editOrReply({
        embeds: [
          new AsepEmbed(
            {
              title: "Gagal menambahkan react pesan ke database!!",
            },
            client,
          ).setType("error"),
        ],
      });
      return;
    }
  }
}
