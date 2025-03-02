import {
  CommandContext,
  createChannelOption,
  Declare,
  Group,
  Options,
  SubCommand,
} from "seyfert";
import { ChannelType } from "seyfert/lib/types/index.js";

const options = {
  channel: createChannelOption({
    description: "channel for set up",
    required: true,
    channel_types: [ChannelType.GuildText],
  }),
};

@Declare({
  name: "delete",
  description: "Delete welcome channel !",
})
@Options(options)
@Group("welcome")
export default class DeleteWelcomeCommand extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { client, options, guildId } = ctx;
    const { channel: targetChannel } = options;
    await ctx.editOrReply({
      content: `channel: ${targetChannel}`,
    });
  }
}
