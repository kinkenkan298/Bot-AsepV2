import WelcomeCanvas from "#asep/structures/utils/classes/canvas/WelcomeChannel.js";
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

    const canvas = await new WelcomeCanvas()
      .setAvatar(
        user.avatarURL({
          extension: "png",
        }),
      )
      .setBackground(
        "image",
        `https://i.pinimg.com/736x/48/03/b4/4803b4bd485b83c1944af16cfd744f6c.jpg`,
      )
      .setTitle("Selamat Datang")
      .setDescription(`Hallo ${user.username}`, "#FBFBFB")
      .setAvatarBorder("#3C3D37")
      .build();
    await ctx.editOrReply({
      content: `Hai ${user?.globalName}, Semoga betah di Akatsuki!`,
      files: [
        new AttachmentBuilder({
          type: "buffer",
          resolvable: canvas,
          filename: `welcomeimage.png`,
        }),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }
}
