import AutoresponModel from "#asep/schemas/guilds/AutoresponModel.js";
import { IAutorespon } from "#asep/structures/utils/interfeces/IAutorespon.js";
import { AsepEmbed } from "#asep/utils/classes/AsepEmbed.js";
import { HydratedDocument } from "mongoose";
import {
  CommandContext,
  createStringOption,
  Declare,
  Options,
  SubCommand,
} from "seyfert/lib/commands/index.js";

const options = {
  pesan: createStringOption({
    description: "kalimat yang nanti mentrigger balesan",
    required: true,
  }),
  balesan: createStringOption({
    description: "kaliamt yang otomatis akan bales",
    required: true,
  }),
};

@Declare({
  name: "create",
  description: "buat pesan otomatis",
})
@Options(options)
export default class CreateSubcommand extends SubCommand {
  public override async run(
    ctx: CommandContext<typeof options>,
  ): Promise<void> {
    await ctx.deferReply();
    const { client, guildId, options } = ctx;
    const { pesan, balesan } = options;

    const fetchData = await AutoresponModel.findOne({ guildId });
    const embed = new AsepEmbed({}, client);
    if (!fetchData) {
      const newData: HydratedDocument<IAutorespon> = new AutoresponModel({
        guildId,
        autorespon: [
          {
            pesan,
            balesan,
          },
        ],
      });
      try {
        await newData.save();
        await ctx.editOrReply({
          embeds: [
            embed
              .setTitle("Pesan Otomatis berhasil di buat !")
              .setDescription(`Pesan: ${pesan}\nBalesan: ${balesan}`)
              .setType("success"),
          ],
        });
      } catch (e) {
        client.logger.error(
          e,
          "Terjadi kesalahan dalam menyimpan nya database!",
        );
        await ctx.editOrReply({
          embeds: [
            embed
              .setTitle("Terjadi kesalahan dalam menyimpan ke database!")
              .setType("error"),
          ],
        });
      }
      return;
    }
    const autoresponder = fetchData.autorespon;
    for (const psn of autoresponder) {
      if (psn.pesan === pesan) {
        await ctx.editOrReply({
          embeds: [
            embed
              .setTitle("Pesan yang ingin ditambahkan sudah tersedia!")
              .setType("error"),
          ],
        });
        return;
      }
    }

    const NewMessage: Record<string, string> = {
      pesan,
      balesan,
    };

    await AutoresponModel.findOneAndUpdate(
      {
        guildId,
      },
      { $push: { autorespon: NewMessage } },
    );
    await ctx.editOrReply({
      embeds: [
        embed
          .setTitle("Pesan Otomatis berhasil di buat !")
          .setDescription(`Pesan: ${pesan}\nBalesan: ${balesan}`)
          .setType("success"),
      ],
    });
  }
}
