import { commandsBot } from "#asep/data/Constants.js";
import { AsepEmbed } from "#asep/utils/classes/AsepEmbed.js";
import { Cooldown, CooldownType } from "@slipher/cooldown";
import ms from "ms";
import { type CommandContext, Declare, SubCommand } from "seyfert";

@Declare({
  name: "perintah",
  description: "Cek perintah apa saja yang tersedia",
})
@Cooldown({
  interval: ms("6s"),
  type: CooldownType.User,
  uses: {
    default: 2,
  },
})
export class PerintahCommand extends SubCommand {
  public override async run(ctx: CommandContext) {
    await ctx.deferReply();
    const embed = new AsepEmbed(
      {
        title: "Berikut perintah yang tersedia pada bot",
        description: commandsBot,
      },
      ctx.client,
    );
    await ctx.editOrReply({
      embeds: [embed],
    });
  }
}
