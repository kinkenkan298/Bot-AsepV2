import WelcomeChannel from "#asep/structures/utils/classes/canvas/WelcomeChannel.js";
import {
  AttachmentBuilder,
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

    const canvas = new WelcomeChannel()
      .setDisplayName(user.globalName || user.username)
      .setMessage("halo")
      .setType("welcome")
      .setAvatar(user.avatarURL({ extension: "png" }));
    const img = await canvas.build({ format: "png" });
    await ctx.editOrReply({
      content: `Hai ${user?.globalName}, Semoga betah di Akatsuki!`,
      files: [
        new AttachmentBuilder({
          type: "buffer",
          resolvable: img,
          filename: `welcomeimage.png`,
        }),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }
}
