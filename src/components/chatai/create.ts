import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { ActionRow, Button, Formatter } from "seyfert";
import { ComponentCommand, ComponentContext } from "seyfert";
import {
  ButtonStyle,
  ChannelType,
  OverwriteType,
} from "seyfert/lib/types/index.js";

export default class ChatAIComponent extends ComponentCommand {
  componentType = "Button" as const;

  filter(ctx: ComponentContext<typeof this.componentType>) {
    return ctx.customId === "chataiasep";
  }
  public override async run(ctx: ComponentContext<typeof this.componentType>) {
    await ctx.deferReply();
    const { client, interaction } = ctx;
    const category = "1335076333629210629";

    const guild = ctx.guild("cache");
    const channel = await guild?.channels.create({
      name: `asep-ai-${ctx.author.id}`,
      type: ChannelType.GuildText,
      topic: `Asep AI dengan  ${ctx.author.username}`,
      permission_overwrites: [
        {
          id: ctx.guildId!,
          deny: "0",
          type: OverwriteType.Member,
        },
        {
          id: interaction.member?.id!,
          allow: "1",
          type: OverwriteType.Member,
        },
      ],
    });
    const channelId = channel?.id;
    const ButtonDelete = new Button({
      style: ButtonStyle.Danger,
      label: "Hapus chat !",
      custom_id: "deletechannelai",
    });
    const btn = new ActionRow<Button>().setComponents([ButtonDelete]);
    await ctx.client.messages.write(channelId!, {
      content: Formatter.userMention(ctx.author.id),
      embeds: [
        new AsepEmbed(
          {
            title: `Hallo ${ctx.author.username}!`,
          },
          client,
        ),
      ],
      components: [btn],
    });
    await ctx.editOrReply({
      content: "Berhasil buat channel khusus !",
    });
  }
}
