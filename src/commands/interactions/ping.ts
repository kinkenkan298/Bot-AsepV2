import { AsepOptions } from "#asep/structures/utils/Decorators.js";
import { AsepCategory } from "#asep/structures/utils/types/index.js";
import {
  Command,
  type CommandContext,
  Declare,
  Embed,
  LocalesT,
} from "seyfert";

@Declare({
  name: "ping",
  description: "Show latency from ping command",
  contexts: ["Guild"],
  integrationTypes: ["GuildInstall"],
})
@AsepOptions({ cooldown: 10, category: AsepCategory.User })
@LocalesT("languages.ping.name", "languages.ping.description")
export default class PingCommand extends Command {
  public override async run(ctx: CommandContext): Promise<void> {
    const { client } = ctx;

    const { messages } = await ctx.getLocale();

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
