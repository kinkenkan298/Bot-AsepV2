import setupChannelModel from "#asep/structures/schemas/guilds/SetupChannel.js";
import { Configuration } from "#asep/structures/utils/data/Configuration.js";
import { ComponentCommand, ComponentContext, Embed, Formatter } from "seyfert";

export default class BtnSkipWelcome extends ComponentCommand {
  componentType = "Button" as const;
  override filter(ctx: ComponentContext): boolean {
    return ctx.customId === "skip_welcome_message";
  }
  override async run(ctx: ComponentContext) {
    const { interaction, guildId, client } = ctx;

    const defaultMessage = `Hallo {username}, Semoga betah di {server-name}`;
    const embed = new Embed({
      title: "Setting welcome channel system!",
      color: Configuration.colors.info,
      timestamp: new Date(Date.now()).toISOString(),
      footer: {
        text: `Asep - Welcome System`,
        icon_url: client.me.avatarURL({ extension: "png" }),
      },
    });

    const data = await setupChannelModel.findOne({ guildId });

    if (!data?.channelId) {
      await interaction.update({
        embeds: [
          embed
            .setDescription("Channel belom di set bang!")
            .setColor(Configuration.colors.errors),
        ],
        components: [],
      });
      return;
    }

    if (!data?.customMessage) {
      await setupChannelModel.findOneAndUpdate(
        {
          guildId,
        },
        {
          guildId,
          customMessage: defaultMessage,
        },
        { upsert: true },
      );
      await interaction.update({
        embeds: [
          embed
            .setDescription(
              `Berhasil membuat welcome channel system!!\nSet ke : ${Formatter.channelMention(data.channelId)}\nPesan Ke ${Formatter.bold(defaultMessage)}`,
            )
            .setColor(Configuration.colors.success),
        ],
        components: [],
      });
    } else {
      await interaction.update({
        embeds: [
          embed
            .setDescription(
              `Berhasil set konfigurasi !!\nSet Ke ${Formatter.channelMention(data.channelId)}\nPesan Ke ${Formatter.bold(data.customMessage)}`,
            )
            .setColor(Configuration.colors.success),
        ],
        components: [],
      });
    }
  }
}
