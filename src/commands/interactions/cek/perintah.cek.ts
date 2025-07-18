import { Constants } from "#asep/data/Constants.js";
import { AsepEmbed } from "#asep/utils/classes/AsepEmbed.js";
import { type CommandContext, Declare, Formatter, SubCommand } from "seyfert";

@Declare({
  name: "perintah",
  description: "Cek perintah apa saja yang tersedia",
})
export default class PerintahCommand extends SubCommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply();
    const embed = new AsepEmbed(
      {
        title: "Berikut perintah yang tersedia pada bot",
        description: Formatter.blockQuote(Constants.commandsBot.trim()),
      },
      ctx.client,
    );
    await ctx.editOrReply({
      embeds: [embed],
    });
  }
}
