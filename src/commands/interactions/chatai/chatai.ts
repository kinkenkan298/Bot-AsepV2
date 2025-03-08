import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { AsepOptions } from "#asep/structures/utils/Decorators.js";
import { AsepCategory } from "#asep/structures/utils/types/index.js";
import { ActionRow, Button, Command, CommandContext, Declare } from "seyfert";
import { ButtonStyle, ComponentType } from "seyfert/lib/types/index.js";

@Declare({
  name: "chatai",
  description: "chat bersama asep kun!",
})
@AsepOptions({ cooldown: 60, category: AsepCategory.User })
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
