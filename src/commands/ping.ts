import { AsepOptions } from "#asep/decorators";
import { AsepCategory } from "#asep/types";
import { Command, type CommandContext, Declare, Embed } from "seyfert";

@Declare({
  name: "ping",
  description: "Show latency from ping command",
  contexts: ["Guild"],
  integrationTypes: ["GuildInstall"],
})
@AsepOptions({
  cooldown: 5,
  category: AsepCategory.User,
})
export default class PingCommand extends Command {
  public override async run(ctx: CommandContext): Promise<void> {
    const { client } = ctx;

    const embed = new Embed()
      .setColor(client.config.colors.extra)
      .setDescription("Pong")
      .setTimestamp();

    await ctx.editOrReply({ embeds: [embed] });

    const wsPing = Math.floor(client.gateway.latency);
    const clientPing = Math.floor(
      Date.now() - (ctx.message ?? ctx.interaction)!.createdTimestamp,
    );
    const shardPing = Math.floor(
      (await ctx.client.gateway.get(ctx.shardId)?.ping()) ?? 0,
    );

    embed
      .setColor(client.config.colors.success)
      .setDescription(
        `Client: ${clientPing}, shard: ${shardPing}, ${wsPing}ms`,
      );

    await ctx.editOrReply({ embeds: [embed] });
  }
}
