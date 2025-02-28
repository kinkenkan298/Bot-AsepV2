import ReactRoleModel from "#asep/structures/schemas/guilds/ReactRoleModel.js";
import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import {
  createStringOption,
  Declare,
  SubCommand,
  CommandContext,
  Options,
} from "seyfert";

const options = {
  messageid: createStringOption({
    description: "ID pesan yang ingin di hapus reactions nya!",
    required: true,
  }),
};

@Declare({
  name: "delete",
  description: "Hapus reactions role pada pesan!",
})
@Options(options)
export default class ReactRoleDelete extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { client, options, guildId, channelId } = ctx;
    const { messageid } = options;
    try {
      const data = await ReactRoleModel.findOne({
        guildId,
        messageId: messageid,
      });
      if (!data) {
        await ctx.editOrReply({
          embeds: [
            new AsepEmbed(
              {
                title: "Tidak ada data react pesan didatabase!",
              },
              client,
            ).setType("error"),
          ],
        });
        return;
      }
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

      const reaction = message.reactions?.find(
        (r) => r.emoji.id === data.emoji || r.emoji.name === data.emoji,
      );
      try {
        if (reaction) {
          const em = reaction?.emoji.id || reaction?.emoji.name || "";
          await client.reactions.delete(messageid, channelId, em);
        }
        await ReactRoleModel.deleteOne({ guildId, messageId: messageid });
        await ctx.editOrReply({
          embeds: [
            new AsepEmbed(
              {
                title: "Berhasil hapus reaction pada pesan!",
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
                title: "Terjadi kesalahan dalam sistem!",
              },
              client,
            ).setType("error"),
          ],
        });
        return;
      }
    } catch (e) {
      client.logger.error(e);
    }
  }
}
