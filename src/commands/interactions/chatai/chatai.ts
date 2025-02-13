import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { Cooldown, CooldownType } from "@slipher/cooldown";
import ms from "ms";
import { ActionRow, Button, Command, CommandContext, Declare } from "seyfert";
import { ButtonStyle, ComponentType } from "seyfert/lib/types/index.js";

@Declare({
  name: "chatai",
  description: "chat bersama asep kun!",
})
@Cooldown({
  interval: ms("60s"),
  type: CooldownType.User,
  uses: {
    default: 1,
  },
})
export default class AICommand extends Command {
  public override async run(ctx: CommandContext) {
    const { client } = ctx;
    await ctx.deferReply();
    const embed = new AsepEmbed(
      {
        title: "Chat dengan asep!",
        description: "Ngobrol dengan ai asep yang sudah di rancang!",
      },
      client,
    );
    const buttonChat = new Button({
      custom_id: "chataiasep",
      type: ComponentType.Button,
      style: ButtonStyle.Primary,
      label: `Chat Asep!`,
    });
    const btn = new ActionRow<Button>().setComponents([buttonChat]);
    await ctx.editOrReply({
      embeds: [embed],
      components: [btn],
    });
  }
}
