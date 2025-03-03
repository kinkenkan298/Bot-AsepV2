import {
  Client,
  Command,
  CommandContext,
  createUserOption,
  Declare,
  Options,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";

const options = {
  user: createUserOption({
    description: "user yang mau di simulasi join! ",
    required: true,
  }),
};

@Declare({
  name: "simulate-join",
  description: "simulasi member ketika join guild!",
})
@Options(options)
export default class SimulateJoinOut extends Command {
  override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply(true);

    const { options, client, guildId } = ctx;
    const { user } = options;

    console.log(client.applicationId);

    await ctx.editOrReply({
      content: `Berhasil simulasi join member ${user?.username} `,
      flags: MessageFlags.Ephemeral,
    });
  }
}
