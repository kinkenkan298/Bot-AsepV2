import { Configuration } from "#asep/data/Configuration.js";
import { GoogleLocalesText } from "#asep/data/Constants.js";
import { AsepEmbed } from "#asep/utils/classes/AsepEmbed.js";
import { splitTextByAmount } from "#asep/utils/functions/utils.js";
import { getCode, Translator } from "google-translate-api-x";
import {
  Command,
  CommandContext,
  createStringOption,
  Declare,
  Embed,
  Formatter,
  IgnoreCommand,
  Options,
} from "seyfert";

const options = {
  to: createStringOption({
    description: "mau di translate ke bahasa apa",
  }),
  from: createStringOption({
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
    let tujuanBahasa = getCode(to || "en");
    if (!tujuanBahasa) {
      await ctx.editOrReply({
        content: "Tolong masukan bahasa yang ada !",
      });
      return;
    }
    const msg = (await ctx.message?.fetch())?.referencedMessage?.content;
    if (!msg) {
      await ctx.editOrReply({
        content: "Text tidak ada bang!",
      });
      return;
    }

    const trans = new Translator({ to: tujuanBahasa });
    const { text, from } = await trans.translate(msg);
    let fromLanguagesText: string = from.language.iso;
    if (from.language.iso in GoogleLocalesText) {
      fromLanguagesText = GoogleLocalesText[fromLanguagesText];
    }
    let toLanguagesText: string = GoogleLocalesText[tujuanBahasa];

    const embed = new AsepEmbed(
      {
        title: `Translated from ${fromLanguagesText} to ${toLanguagesText}`,
      },
      ctx.client,
    );
    const totalLength = msg.length + text.length;
    const title = Formatter.bold(`${fromLanguagesText} -> ${toLanguagesText}`);
    if (totalLength <= 4000) {
      const parts = splitTextByAmount(text, 1007, "");
      embed.addFields([
        {
          name: title,
          value: Formatter.codeBlock(parts.shift()! as string),
        },
      ]);
      for (let part of parts) {
        embed.addFields([
          {
            name: "\u200b",
            value: Formatter.codeBlock(part),
          },
        ]);
      }
    }
    await ctx.editOrReply({
      embeds: [embed],
    });
  }
}
