import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { Constants } from "#asep/structures/utils/data/Constants.js";
import {
  sendSingleVideo,
  sendSlideShow,
  extractInstagram,
} from "#asep/structures/utils/functions/index.js";
import { ItemMedia } from "#asep/structures/utils/types/index.js";
import {
  CommandContext,
  createStringOption,
  Declare,
  OKFunction,
  OnOptionsReturnObject,
  Options,
  SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";

const options = {
  url: createStringOption({
    description: "Link instagram yang ingin di share!",
    required: true,
    value(data, ok: OKFunction<URL>, fail) {
      if (Constants.InstaURLRegex.test(data.value))
        return ok(new URL(data.value));
      fail("Tolong periksa ulang link instagram nya!");
    },
  }),
};

@Declare({
  name: "ainsta",
  description: "Bagikan atau kirim video instagram mu di dc!!",
})
@Options(options)
export default class AInstaCommand extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { client, options } = ctx;
    const { url } = options;

    const data: Array<ItemMedia> = await extractInstagram(url.toString());
    if (data.length === 1 && data[0].type === "video") {
      await sendSingleVideo(data[0], client, ctx);
    } else if (data.length > 1 && data[0].type === "image") {
      await sendSlideShow(data, client, ctx);
    }
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
