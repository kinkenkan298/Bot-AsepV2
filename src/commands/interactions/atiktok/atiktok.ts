import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { TiktokURLregex } from "#asep/structures/utils/data/Constants.js";
import { scrapperTiktok } from "#asep/structures/utils/functions/tiktokdl.js";
import { existsSync, unlinkSync } from "fs";
import ms from "ms";
import {
  Command,
  CommandContext,
  createStringOption,
  Declare,
  OKFunction,
  Options,
  AttachmentBuilder,
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
    const { client, options, interaction } = ctx;
    const { url } = options;
    await ctx.deferReply();
    try {
      const getTiktok = await scrapperTiktok(url.toString());
      if (!getTiktok[0]) throw new Error("error tidak diketahui!");
      if (getTiktok.length === 1 && getTiktok[0].type === "video") {
        const resultVideo = getTiktok[0];
        let selected_variants = resultVideo.variants[0];
        for (const variant of resultVideo.variants) {
          if (variant.content_length > selected_variants.content_length) {
            selected_variants = variant;
          }
        }
        if (
          selected_variants.content_length >= 100 * 1024 * 1024 ||
          selected_variants.content_length > 25 * 1024 * 1024
        ) {
          await ctx.editOrReply({
            embeds: [
              new AsepEmbed(
                {
                  title: "File berukuran terlalu besar!",
                },
                client,
              ).setType("error"),
            ],
          });
          return;
        } else {
          const fileName = selected_variants.file_name || "tiktok.mp4";
          try {
            const tiktokAttach = new AttachmentBuilder()
              .setName(fileName)
              .setFile("path", selected_variants.uri_path);
            await ctx.editOrReply({
              files: [tiktokAttach],
            });
          } catch (e) {
            await ctx.editOrReply({
              embeds: [
                new AsepEmbed(
                  {
                    title: "Terjadi kesalahan dalam mengirim file!!",
                    description:
                      "Tolong periksa ulang internet atau coba lagi nanti!",
                  },
                  client,
                ).setType("error"),
              ],
            });
            return;
          } finally {
            if (existsSync(selected_variants.uri_path))
              unlinkSync(selected_variants.uri_path);
          }
        }
      } else if (getTiktok.find((fd) => fd.type === "audio")) {
        const batchFile = 10;
        const tempPath: string[] = [];
        for (let i = 0; i < getTiktok.length; i += batchFile) {
          const batch = getTiktok.slice(i, i + batchFile);
          const image_path = [];
          for (const item of batch) {
            if (!item.variants[0]) throw new Error("error tidak diketahui!");
            tempPath.push(item.variants[0].uri_path);
            if (item.type === "image") {
              image_path.push(
                new AttachmentBuilder()
                  .setName(item.variants[0].file_name || "tiktok-image.jpg")
                  .setFile("path", item.variants[0].uri_path),
              );
            } else {
              image_path.push(
                new AttachmentBuilder()
                  .setName(item.variants[0].file_name || "audio.mp3")
                  .setFile("path", item.variants[0].uri_path),
              );
            }
          }

          if (image_path.length > 0) {
            await interaction?.followup({
              files: image_path,
            });
          }
        }
        setTimeout(() => {
          for (const pth of tempPath) {
            if (existsSync(pth)) unlinkSync(pth);
          }
        }, ms("5s"));
      }
    } catch (e) {
      client.logger.error(e);
    }
  }
}
