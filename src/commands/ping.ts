import { Command, type CommandContext, Declare } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
  name: "ping",
  description: "Show latency from ping command",
})
export default class PingCommand extends Command {
  async run(ctx: CommandContext) {
    await ctx.deferReply(true);
    const ping = ctx.client.gateway.latency;
    await ctx.editOrReply({
      content: `The latency ping : ${ping}ms`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
