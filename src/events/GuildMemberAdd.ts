import WelcomeCanvas from "#asep/structures/utils/classes/canvas/WelcomeChannel.js";
import { AttachmentBuilder, createEvent } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";

export default createEvent({
  data: { name: "guildMemberAdd" },
  async run(member, client) {
    const canvas = await new WelcomeCanvas()
      .setAvatar(
        member.avatarURL({
          extension: "png",
        }),
      )
      .setBackground(
        "image",
        `https://i.pinimg.com/736x/48/03/b4/4803b4bd485b83c1944af16cfd744f6c.jpg`,
      )
      .setTitle("Selamat Datang")
      .setDescription(`Hallo ${member.username}`, "#FBFBFB")
      .setAvatarBorder("#ffffff")
      .build();
    await client.messages.write("1335076333629210630", {
      content: `Hai ${member?.username}, Semoga betah di Akatsuki!`,
      files: [
        new AttachmentBuilder({
          type: "buffer",
          resolvable: canvas,
          filename: `welcomeimage.png`,
        }),
      ],
      flags: MessageFlags.Ephemeral,
    });
  },
});
