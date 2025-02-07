import {
  Command,
  CommandContext,
  createStringOption,
  Declare,
  IgnoreCommand,
  Options,
} from "seyfert";

const options = {
  from: createStringOption({
    description: "dari bahasa apa teks nya?",
  }),
  to: createStringOption({
    description: "mau di translate ke bahasa apa",
  }),
};

@Declare({
  name: "translate",
  description: "translate your language",
  aliases: ["tr"],
  contexts: ["Guild"],
  ignore: IgnoreCommand.Slash,
})
@Options(options)
export default class TranslateCommand extends Command {
  public override async run(ctx: CommandContext<typeof options>) {
    const { to } = ctx.options;

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
