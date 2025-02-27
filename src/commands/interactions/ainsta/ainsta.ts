import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { InstaURLRegex } from "#asep/structures/utils/data/Constants.js";
import { extractInstagram } from "#asep/structures/utils/functions/scrappers/instagram.js";
import {
  Command,
  CommandContext,
  createStringOption,
  Declare,
  IgnoreCommand,
  OKFunction,
  OnOptionsReturnObject,
  Options,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";

const options = {
  url: createStringOption({
    description: "Link instagram yang ingin di share!",
    required: true,
    value(data, ok: OKFunction<URL>, fail) {
      if (InstaURLRegex.test(data.value)) return ok(new URL(data.value));
      fail("Tolong periksa ulang link instagram nya!");
    },
  }),
};

@Declare({
  name: "ainsta",
  description: "Bagikan atau kirim video instagram mu di dc!!",
  ignore: IgnoreCommand.Message,
})
@Options(options)
export default class AInstaCommand extends Command {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { client, options } = ctx;
    const { url } = options;

    const data = await extractInstagram(url.toString());
    console.log(data);

    await ctx.editOrReply({
      content: `Link: ${url}`,
    });
  }
  public override async onOptionsError(
    ctx: CommandContext,
    metadata: OnOptionsReturnObject,
  ) {
    const msg = Object.entries(metadata)
      .filter((_) => _[1].failed)
      .map((e) => `${e[1].value}`);
    await ctx.editOrReply({
      embeds: [
        new AsepEmbed(
          {
            title: "Terjadi kesalahan pada opsi yang diterima!!",
            description: `**${msg[0]}**`,
          },
          ctx.client,
        ).setType("error"),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }
}
