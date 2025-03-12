import autoresponModel from "#asep/structures/schemas/guilds/AutoresponModel.js";
import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { ModalCommand, type ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";

export default class DeleteutoresponModal extends ModalCommand {
  override filter(ctx: ModalContext): boolean {
    return ctx.customId === "deleteModal_autorespon";
  }
  override async run(ctx: ModalContext) {
    const { client, interaction, guildId } = ctx;
    const triggerMessage = interaction.getInputValue(
      "trigger_autorespon",
      true,
    );
    const embed = new AsepEmbed(
      {
        title: "Konfigurasi Autoresponder!",
      },
      client,
    ).setType("info");

    const data = await autoresponModel.findOne({
      guildId,
      "autorespon.pesan": triggerMessage,
    });
    if (!data) {
      await interaction.editOrReply({
        embeds: [
          embed
            .setType("error")
            .setTitle("Pesan yang ingin dihapus tidak ada !")
            .setDescription(
              `Pesan: ${triggerMessage}\nTolong periksa ulang pesan nya!`,
            ),
        ],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await autoresponModel.findOneAndUpdate(
      {
        guildId,
      },
      {
        $pull: { autorespon: { pesan: triggerMessage } },
      },
    );
    await interaction.update({
      embeds: [
        embed
          .setType("success")
          .setTitle("Pesan otomatis sudah dihapus!!")
          .setDescription(`Pesan: ${triggerMessage}!`),
      ],
    });
  }
}
