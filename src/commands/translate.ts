import {
  Command,
  CommandContext,
  createStringOption,
  Declare,
  IgnoreCommand,
  Options,
} from "seyfert";

const options = {
  to: createStringOption({
    description: "mau di translate ke bahasa apa",
    required: true,
  }),
  kalimat: createStringOption({
    description: "Kalimat yang mau di translate",
  }),
};

@Declare({
  name: "translate",
  description: "translate your language",
  aliases: ["tr"],
  contexts: ["Guild"],
})
@Options(options)
export default class TranslateCommand extends Command {
  public override async run(ctx: CommandContext<typeof options>) {
    const { to } = ctx.options;
    const msg = (await ctx.message?.fetch())?.referencedMessage?.content;

    await ctx.editOrReply({
      content: "Ke bahasa : " + to,
    });
  }
  public override async onRunError(ctx: CommandContext, error: unknown) {
    ctx.client.logger.fatal(error);
    await ctx.write({
      content: "error bg bentr",
    });
  }
}
