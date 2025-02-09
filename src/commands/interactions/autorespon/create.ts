import AutoresponModel from "#asep/schemas/guilds/AutoresponModel.js";
import { AsepEmbed } from "#asep/utils/classes/AsepEmbed.js";
import { Cooldown, CooldownType } from "@slipher/cooldown";
import ms from "ms";
import {
  CommandContext,
  createStringOption,
  Declare,
  Options,
  SubCommand,
} from "seyfert/lib/commands/index.js";

const options = {
  pesan: createStringOption({
    description: "kaliamt yang nanti mentrigger balesan",
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
@Cooldown({
  interval: ms("10s"),
  type: CooldownType.User,
  uses: {
    default: 1,
  },
})
@Options(options)
export default class CreateSubcommand extends SubCommand {
  public override async run(
    ctx: CommandContext<typeof options>,
  ): Promise<void> {
    const { client, interaction, guildId, options } = ctx;
    if (!interaction?.replied) await ctx.deferReply();
    const { pesan, balesan } = options;

    const fetchData = await AutoresponModel.findOne({ guildId });
    const embed = new AsepEmbed({}, client);
    if (!fetchData) {
      const newData = new AutoresponModel({
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
      pesan: pesan,
      balesan: balesan,
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
