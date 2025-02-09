import { Configuration } from "#asep/data/Configuration.js";
import AutoresponModel from "#asep/schemas/guilds/AutoresponModel.js";
import { Cooldown, CooldownType } from "@slipher/cooldown";
import ms from "ms";
import { CommandContext, Declare, Embed, Formatter, SubCommand } from "seyfert";

@Declare({
  name: "list",
  description: "list apa saja pesan otomatis yang tersedia!",
  contexts: ["Guild"],
})
@Cooldown({
  interval: ms("10s"),
  type: CooldownType.User,
  uses: {
    default: 1,
  },
})
export default class ListSubcommand extends SubCommand {
  public override async run(ctx: CommandContext) {
    const { client, interaction, guildId } = ctx;
    if (!interaction?.replied) await ctx.deferReply();
    const embed = new Embed({
      author: {
        name: "Asep V2",
        icon_url: "https://i.ibb.co.com/n80TYD2w/xiao.jpg",
      },
      footer: {
        text: "Asep V2 System",
        icon_url: "https://i.ibb.co.com/n80TYD2w/xiao.jpg",
      },
      timestamp: new Date(Date.now()).toISOString(),
    });
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
              .setColor(Configuration.colors.errors),
          ],
        });
        return;
      }
      const fields: Array<{ name: string; value: string }> = [];
      fetchData.autorespon.forEach((d, i) => {
        fields.push({
          name: `${Formatter.underline("Pesan")}  ${i + 1}`,
          value: `Pesan: ${d.pesan}\nBalesan: ${d.balesan}`,
        });
      });
      await ctx.editOrReply({
        embeds: [
          embed
            .addFields(fields)
            .setTitle("Berikut ini list pesan otomatis nya!")
            .setColor(Configuration.colors.success),
        ],
      });
    } catch (e) {
      client.logger.error(e);
    }
  }
}
