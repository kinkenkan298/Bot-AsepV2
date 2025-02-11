import { ComponentCommand, ComponentContext } from "seyfert";

export default class DeleteChatAIComponent extends ComponentCommand {
  componentType = "Button" as const;
  filter(ctx: ComponentContext<typeof this.componentType>) {
    return ctx.customId === "deletechannelai";
  }
  override async run(ctx: ComponentContext<typeof this.componentType>) {
    await ctx.editOrReply({
      content: "Hai",
    });
  }
}
