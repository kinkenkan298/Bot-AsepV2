import { type CommandContext, Declare, Embed, SubCommand } from "seyfert";
import { commandsBot } from "../../constant/help";

@Declare({
  name: "perintah",
  description: "Cek perintah apa saja yang tersedia",
})
export class PerintahCommand extends SubCommand {
  async run(ctx: CommandContext) {
    await ctx.deferReply();
    const embed = new Embed({
      author: {
        name: "Asep V2",
        icon_url: "https://i.ibb.co.com/n80TYD2w/xiao.jpg",
      },
      title: "Berikut perintah yang tersedia pada bot",
      description: commandsBot,
      color: 0x00b0f4,
      footer: {
        text: "Asep V2",
        icon_url: "https://i.ibb.co.com/n80TYD2w/xiao.jpg",
      },
      timestamp: new Date(Date.now()).toISOString(),
    });
    await ctx.editOrReply({
      embeds: [embed],
    });
  }
}
