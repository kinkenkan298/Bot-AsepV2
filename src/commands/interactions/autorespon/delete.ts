import AutoresponModel from "#/structures/schemas/guilds/AutoresponModel.js";
import { AsepEmbed } from "#/structures/utils/classes/AsepEmbed.js";
import { Cooldown, CooldownType } from "@slipher/cooldown";
import ms from "ms";
import {
  CommandContext,
  createStringOption,
  Declare,
  Options,
  SubCommand,
} from "seyfert";

const options = {
  pesan: createStringOption({
    description: "Pesan apa yang ingin dihapus?",
    required: true,
  }),
};

@Declare({
  name: "delete",
  description: "hapus pesan otomatis",
  contexts: ["Guild"],
})
@Cooldown({
  interval: ms("10s"),
  type: CooldownType.User,
  uses: {
    default: 1,
  },
})
@Options(options)
export default class DeleteSubcommand extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    const { client, interaction, guildId, options } = ctx;
    if (!interaction?.replied) await ctx.deferReply();

    const { pesan } = options;
    const embed = new AsepEmbed({}, client);
    try {
      const fetchData = await AutoresponModel.findOne({
        guildId,
        "autorespon.pesan": pesan,
      });
      if (!fetchData) {
        await ctx.editOrReply({
          embeds: [
            embed
              .setType("error")
              .setTitle("Pesan yang ingin dihapus tidak ada !")
              .setDescription(
                `Pesan: ${pesan}\nTolong periksa ulang pesan nya!`,
              ),
          ],
        });
        return;
      }
      await AutoresponModel.findOneAndUpdate(
        { guildId },
        { $pull: { autorespon: { pesan } } },
      );
      await ctx.editOrReply({
        embeds: [
          embed
            .setType("success")
            .setTitle("Pesan otomatis sudah dihapus!!")
            .setDescription(`Pesan: ${pesan}!`),
        ],
      });
    } catch (e) {
      client.logger.error(e);
    }
  }
}
