import SetupChannelModel from "#asep/structures/schemas/guilds/SetupChannel.js";
import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import {
  CommandContext,
  createChannelOption,
  Declare,
  Group,
  Options,
  SubCommand,
} from "seyfert";
import { ChannelType } from "seyfert/lib/types/index.js";

const options = {
  channel: createChannelOption({
    description: "channel for set up",
    required: true,
    channel_types: [ChannelType.GuildText],
  }),
};

@Declare({
  name: "delete",
  description: "Delete welcome channel !",
})
@Options(options)
@Group("welcome")
export default class DeleteWelcomeCommand extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { client, options, guildId } = ctx;
    const { channel: targetChannel } = options;

    const data = await SetupChannelModel.findOne({ guildId });

    if (!data || data.channelId !== targetChannel.id) {
      await ctx.editOrReply({
        embeds: [
          new AsepEmbed(
            {
              title: "Channel yang kamu masukan tidak ada didatabase!",
            },
            client,
          ).setType("error"),
        ],
      });
      return;
    }

    try {
      await SetupChannelModel.findOneAndDelete({
        guildId,
        channelId: targetChannel.id,
      });
      await ctx.editOrReply({
        embeds: [
          new AsepEmbed(
            {
              title: "Berhasil hapus welcome channel didatabase!",
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
              title: "Terjadi kesalahan tidak terduga!",
              description: "Silakan coba lagi beberap saat!",
            },
            client,
          ).setType("error"),
        ],
      });
    }
  }
}
