import AutoresponModel from "#asep/schemas/guilds/AutoresponModel.js";
import { AsepEmbed } from "#asep/utils/classes/AsepEmbed.js";
import { CommandContext, Declare, Formatter, SubCommand } from "seyfert";

@Declare({
  name: "list",
  description: "list apa saja pesan otomatis yang tersedia!",
  contexts: ["Guild"],
})
export default class ListSubcommand extends SubCommand {
  public override async run(ctx: CommandContext) {
    const { client, interaction, guildId } = ctx;
    if (!interaction?.replied) await ctx.deferReply();
    const embed = new AsepEmbed({}, client);
    try {
      const fetchData = await AutoresponModel.findOne({ guildId });
      if (
        !fetchData ||
        !fetchData.autorespon ||
        fetchData.autorespon.length == 0
      ) {
        await ctx.editOrReply({
          embeds: [
            embed
              .setTitle("Tidak ada pesan otomatis")
              .setDescription("Tolong tambahkan pesan otomatis!")
              .setType("error"),
          ],
        });
        return;
      }
      const fields: Array<{ name: string; value: string }> = [];
      fetchData.autorespon.forEach(
        (d: { pesan: string; balesan: string }, i: number) => {
          fields.push({
            name: `${Formatter.underline("Pesan")}  ${i + 1}`,
            value: `Pesan: ${d.pesan}\nBalesan: ${d.balesan}`,
          });
        },
      );
      await ctx.editOrReply({
        embeds: [
          embed
            .addFields(fields)
            .setTitle("Berikut ini list pesan otomatis nya!"),
        ],
      });
    } catch (e) {
      client.logger.error(e);
    }
  }
}
