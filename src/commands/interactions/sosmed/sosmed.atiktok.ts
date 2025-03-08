import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { TiktokURLregex } from "#asep/structures/utils/data/Constants.js";
import {
  extractTiktok,
  sendSingleVideo,
  sendSlideShow,
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
    description: "url tiktok!",
    required: true,
    value(data, ok: OKFunction<URL>, fail) {
      if (TiktokURLregex.test(data.value)) return ok(new URL(data.value));
      fail("yang kamu masukan bukan url tiktok!");
    },
  }),
};

@Declare({
  name: "atiktok",
  description: "Kirim video tiktokmu",
})
@Options(options)
export default class ATiktokCommand extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    const { options, client } = ctx;
    const { url } = options;
    await ctx.deferReply();
    let items: Array<ItemMedia>;
    items = await extractTiktok(url.toString());
    if (!items[0]) throw new Error("Error tidak ketahui!");
    if (items.length === 1 && items[0].type === "video") {
      await sendSingleVideo(items[0], client, ctx);
    } else if (items.find((fd) => fd.type === "audio")) {
      await sendSlideShow(items, client, ctx);
    }
  }
  public override async onRunError(context: CommandContext, error: unknown) {
    context.client.logger.error(error);
    context.editOrReply({
      embeds: [
        new AsepEmbed(
          {
            title: "Terjadi kesalahan tidak terduga!",
            description: "Silakan coba lagi nanti!",
          },
          context.client,
        ).setType("error"),
      ],
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
