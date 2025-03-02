import {
  CommandContext,
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
  description: "Setup welcome channel untuk member yang baru join!",
})
@Options(options)
@Group("welcome")
export default class SetupWelcomeCommand extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { client, options, guildId } = ctx;
    const {
      channel: targetChannel,
      message: customMessage = "Halo {username}, Semoga betah di {server-name}",
    } = options;
    await ctx.editOrReply({
      content: `channel: ${targetChannel}\npesan: ${customMessage}`,
    });
  }
}
