import autoresponModel from "#asep/structures/schemas/guilds/AutoresponModel.js";
import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { IAutorespon } from "#asep/structures/utils/interfeces/IAutorespon.js";
import { HydratedDocument } from "mongoose";
import { ModalCommand, type ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";

export default class AddAutoresponModal extends ModalCommand {
  override filter(ctx: ModalContext): boolean {
    return ctx.customId === "createModal_autorespon";
  }
  async run(ctx: ModalContext) {
    const { client, interaction, guildId } = ctx;

    const triggerMessage = interaction.getInputValue(
      "trigger_autorespon",
      true,
    );
    const responseMessage = interaction.getInputValue(
      "response_autorespon",
      true,
    );

    const embed = new AsepEmbed(
      {
        title: "Konfigurasi Autoresponder!",
      },
      client,
    ).setType("info");

    const data = await autoresponModel.findOne({ guildId });

    if (!data) {
      try {
        const newData: HydratedDocument<IAutorespon> = new autoresponModel({
          guildId,
          autorespon: [
            {
              pesan: triggerMessage,
              balesan: responseMessage,
            },
          ],
        });
        newData.save();
        await interaction.update({
          embeds: [
            embed
              .setDescription(
                "Berhasil Tambah Autoresponder baru!\nJika Masih ada yang ingin ditambah silakan klik dibawah\nAtau jika sudah selesai klik **stop event**!",
              )
              .setType("success"),
          ],
        });
      } catch (e) {
        client.logger.error(e);
        await ctx.editOrReply({
          embeds: [
            embed
              .setDescription(
                "Terjadi error ketika mau save data!\nSilakan coba lagi beberapa saat!",
              )
              .setType("error"),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }
      return;
    }
    const newRespon: { pesan: string; balesan: string } = {
      pesan: triggerMessage,
      balesan: responseMessage,
    };
    if (data.autorespon.length === 0) {
      try {
        await autoresponModel.findOneAndUpdate(
          {
            guildId,
          },
          {
            $push: {
              autorespon: newRespon,
            },
          },
        );
        await interaction.update({
          embeds: [
            embed
              .setDescription(
                "Berhasil Tambah Autoresponder baru!\nJika Masih ada yang ingin ditambah silakan klik dibawah\nAtau jika sudah selesai klik **stop event**!",
              )
              .setType("success"),
          ],
        });
      } catch (e) {
        client.logger.error(e);
        await ctx.editOrReply({
          embeds: [
            embed
              .setDescription(
                "terjadi error ketika mau save data!\nsilakan coba lagi beberapa saat!",
              )
              .setType("error"),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }
      return;
    }

    for (const p of data.autorespon) {
      if (p.pesan === triggerMessage) {
        await ctx.editOrReply({
          embeds: [
            embed
              .setDescription(
                "terjadi error ketika mau save data!\nsilakan coba lagi beberapa saat!",
              )
              .setType("error"),
          ],
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }

    await autoresponModel.findOneAndUpdate(
      {
        guildId,
      },
      { $push: { autorespon: newRespon } },
    );

    await interaction.update({
      embeds: [
        embed
          .setDescription("Berhasil menambahkan Autoresponder!!")
          .setType("success"),
      ],
    });
  }
}
