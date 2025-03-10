import setupChannelModel from "#asep/structures/schemas/guilds/SetupChannel.js";
import { Configuration } from "#asep/structures/utils/data/Configuration.js";
import { Embed, Formatter, ModalCommand, type ModalContext } from "seyfert";

export default class EditMessage extends ModalCommand {
  override filter(context: ModalContext): boolean {
    return context.customId === "edit_message";
  }
  override async run(ctx: ModalContext) {
    const { guildId, interaction, client } = ctx;
    const embed = new Embed({
      title: "Setting welcome channel system!",
      color: Configuration.colors.info,
      timestamp: new Date(Date.now()).toISOString(),
      footer: {
        text: `Asep - Welcome System`,
        icon_url: client.me.avatarURL({ extension: "png" }),
      },
    });
    const textMessage = interaction.getInputValue("customWelcomeMessage", true);

    await setupChannelModel.findOneAndUpdate(
      { guildId },
      { guildId, customMessage: textMessage },
      { upsert: true },
    );
    await interaction.update({
      embeds: [
        embed
          .setDescription(
            `Berhasil edit welcome message !!\nSet Ke ${Formatter.bold(textMessage)}`,
          )
          .setColor(Configuration.colors.success),
      ],
      components: [],
    });
  }
}
