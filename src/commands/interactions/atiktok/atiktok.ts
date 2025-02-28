import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { TiktokURLregex } from "#asep/structures/utils/data/Constants.js";
import { sendSlideShow } from "#asep/structures/utils/functions/client/sendSlideShow.js";
import {
  extractTiktok,
  sendSingleVideo,
} from "#asep/structures/utils/functions/index.js";
import { ItemMedia } from "#asep/structures/utils/types/index.js";
import {
  Command,
  CommandContext,
  createStringOption,
  Declare,
  IgnoreCommand,
  OKFunction,
  Options,
} from "seyfert";

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
  aliases: ["tt"],
  ignore: IgnoreCommand.Message,
})
@Options(options)
export default class ATiktokCommand extends Command {
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
}
