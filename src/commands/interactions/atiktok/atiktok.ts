import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { TiktokURLregex } from "#asep/structures/utils/data/Constants.js";
import downloadFile from "#asep/structures/utils/functions/downloadFile.js";
import {
  extractTiktok,
  sendSingleVideo,
} from "#asep/structures/utils/functions/index.js";
import { ItemVideo } from "#asep/structures/utils/types/index.js";
import { existsSync, unlinkSync } from "fs";
import { AttachmentBuilder } from "seyfert";
import {
  Command,
  CommandContext,
  createStringOption,
  Declare,
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
})
@Options(options)
export default class ATiktokCommand extends Command {
  public override async run(ctx: CommandContext<typeof options>) {
    const { options, client } = ctx;
    const { url } = options;
    await ctx.deferReply();
    let items: Array<ItemVideo>;
    items = await extractTiktok(url.toString());
    if (!items[0]) throw new Error("Error tidak ketahui!");
    if (items.length === 1 && items[0].type === "video") {
      await sendSingleVideo(items[0], client, ctx);
    } else if (items.find((fd) => fd.type === "audio")) {
      const batchFile = 10;
      const tempPath: string[] = [];
      for (let i = 0; i < items.length; i += batchFile) {
        const batch = items.slice(i, i + batchFile);
        const image_path: AttachmentBuilder[] = [];
        for (const item of batch) {
          if (!items[0].variants) throw new Error("Error tidak diketahui!");
          let fileName: string;
          if (item.type === "image") {
            fileName = `tiktokImage-${Math.floor(Math.random() * 1000)}-temp.jpg`;
          } else {
            fileName = `tiktokAudio-${Math.floor(Math.random() * 1000)}-temp.mp3`;
          }
          const downFile = await downloadFile(item.variants[0].href, fileName);
          tempPath.push(downFile);
          image_path.push(
            new AttachmentBuilder().setName(fileName).setFile("path", downFile),
          );
        }

        if (image_path.length > 0) {
          await ctx.interaction?.followup({
            files: image_path,
          });
        }
      }
      setTimeout(() => {
        for (const pth of tempPath) {
          if (existsSync(pth)) unlinkSync(pth);
        }
      }, 5000);
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
