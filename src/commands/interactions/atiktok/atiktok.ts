import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import downloadFile from "#asep/structures/utils/functions/downloadFile.js";
import { Downloader } from "@tobyg74/tiktok-api-dl";
import {
  Command,
  CommandContext,
  createStringOption,
  Declare,
  OKFunction,
  Options,
  AttachmentBuilder,
} from "seyfert";

const TiktokURLregex =
  /https:\/\/(?:m|www|vm|vt|lite)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video|photo)\/|\?shareId=|\&item_id=)(\d+))|\w+)/;

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
    const { client, options } = ctx;
    const { url } = options;
    await ctx.deferReply();
    try {
      const fetchTiktok = await Downloader(url.toString(), { version: "v1" });
      if (!fetchTiktok.result || fetchTiktok.status === "error") {
        await ctx.editOrReply({
          embeds: [
            new AsepEmbed(
              {
                title: "Terjadi kesalahan pada url tiktok nya!",
                description: "Tolong periksa lagi url tiktok nya!",
              },
              client,
            ).setType("error"),
          ],
        });
      }
      const result = fetchTiktok.result;
      switch (result?.type) {
        case "video": {
          const urlDownload =
            result?.video?.playAddr[0] ||
            result.video?.playAddr[1] ||
            result?.video?.playAddr[2];
          if (!urlDownload) {
            await ctx.editOrReply({
              content: "Terjadi kesalahan dalam mendapatkan link download!",
            });
            return;
          }
          const fileName = `tiktok-${Math.round(Math.random() * 1000)}-temp.mp4`;
          const filePath = await downloadFile(urlDownload, fileName);
          const attachFileTiktok = new AttachmentBuilder()
            .setFile("path", filePath)
            .setName(fileName);
          await ctx.editOrReply({
            files: [attachFileTiktok],
          });
          break;
        }
        case "image": {
          await ctx.editOrReply({
            embeds: [
              new AsepEmbed(
                {
                  title: "tipe image",
                },
                client,
              ),
            ],
          });
          break;
        }
      }
    } catch (e) {
      client.logger.error(e);
    }
  }
}
