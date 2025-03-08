import {
  type CommandContext,
  createChannelOption,
  createStringOption,
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
  message: createStringOption({
    description: "Ubah pesan sesuai keinginan!",
  }),
};
@Declare({
  name: "create",
  description: "Set up for member leave from guild!",
})
@Options(options)
@Group("leave")
export default class SetupLeaveChannel extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.editOrReply({
      content: "hai",
    });
  }
}
