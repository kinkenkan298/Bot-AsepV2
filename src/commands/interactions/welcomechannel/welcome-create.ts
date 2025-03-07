import {
  CommandContext,
  createChannelOption,
  createStringOption,
  Declare,
  Group,
  Options,
  SubCommand,
} from "seyfert";
import { ChannelType } from "seyfert/lib/types/index.js";
import SetupChannelModel from "#asep/structures/schemas/guilds/SetupChannel.js";
import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { HydratedDocument } from "mongoose";
import { IWelcome } from "#asep/structures/utils/interfeces/ISetupChannel.js";

const options = {
  channel: createChannelOption({
    description: "channel for set up",
    required: true,
    channel_types: [ChannelType.GuildText],
  }),
  message: createStringOption({
    description: "Ubah pesan sesuai keinginan!",
  }),
};

@Declare({
  name: "create",
  description: "Setup welcome channel untuk member yang baru join!",
})
@Options(options)
@Group("welcome")
export default class SetupWelcomeCommand extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { client, options, guildId } = ctx;
    const { channel: targetChannel, message: customMessage } = options;

    const data = await SetupChannelModel.findOne({ guildId });

    if (!data) {
      const newData: HydratedDocument<IWelcome> = new SetupChannelModel({
        guildId,
        channelId: targetChannel.id,
        customMessage: customMessage
          ? customMessage
          : "Halo {username}, Semoga betah diserver {server-name}",
      });
      try {
        await newData.save();
        await ctx.editOrReply({
          embeds: [
            new AsepEmbed(
              {
                title: "Beehasil simpan welcome channel didatabase!",
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
                title: "Terjadi kesalahan dalam save data kedatabase!",
                description: "Tolong coba lagi beberapa saat kemudan!",
              },
              client,
            ).setType("error"),
          ],
        });
      }
      return;
    }

    if (data && data.channelId === targetChannel.id) {
      await ctx.editOrReply({
        embeds: [
          new AsepEmbed(
            {
              title: "Channel yang ada masukan sudah ada didalam database!",
            },
            client,
          ).setType("error"),
        ],
      });
    }

    if (data.channelId !== targetChannel.id) {
      try {
        const cMessage = customMessage ? customMessage : data.customMessage;
        data.channelId = targetChannel.id;
        data.customMessage = cMessage;
        data.save();
        await ctx.editOrReply({
          embeds: [
            new AsepEmbed(
              {
                title: "Beehasil update welcome channel didatabase!",
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
                title: "Terjadi kesalahan dalam update data ke database!!",
                description: "Tolong coba lagi beberapa saat!",
              },
              client,
            ).setType("error"),
          ],
        });
      }
    }
  }
}
