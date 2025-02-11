import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import {
  CommandContext,
  createChannelOption,
  Declare,
  Options,
  SubCommand,
} from "seyfert";
import { ChannelType } from "seyfert/lib/types/index.js";

const options = {
  category: createChannelOption({
    description: "category channel yang ingin dijadiin chatai!",
    required: true,
    channel_types: [ChannelType.GuildCategory],
  }),
};
@Declare({
  name: "add",
  description: "tambah category untuk chatai asep!",
})
@Options(options)
export class SetupAdd extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { client, guildId, options } = ctx;
    const { category } = options;
    try {
      const embed = new AsepEmbed(
        {
          title: "hai",
        },
        client,
      );
      await ctx.editOrReply({
        content: "add",
        embeds: [embed],
      });
    } catch (e) {
      client.logger.error(e);
    }
  }
}
