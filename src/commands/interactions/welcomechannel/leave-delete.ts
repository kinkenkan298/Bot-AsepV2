import {
  type CommandContext,
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
  description: "Delete channel leave guild!",
})
@Options(options)
@Group("leave")
export default class DeleteLeaveChannel extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.editOrReply({
      content: "hai",
    });
  }
}
