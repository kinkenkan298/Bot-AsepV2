import { CommandContext } from "seyfert";
import { ItemVideo } from "../../types/index.js";
import { AsepEmbed } from "../../classes/AsepEmbed.js";
import downloadFile from "../downloadFile.js";
import { AttachmentBuilder } from "seyfert";
import { existsSync, unlinkSync } from "node:fs";

export const sendSingleVideo = async (
  item: ItemVideo,
  context: CommandContext,
) => {
  const { client } = context;
  if (item.type !== "video")
    throw new Error("Item yang diberikan bukan video!");
  if (!item.variants[0]) throw new Error("Item tidak ada isi nya!");

  let selected_variants = item.variants[0];
  for (const variant of item.variants) {
    if (variant.content_length > selected_variants.content_length) {
      selected_variants = variant;
    }
  }

  if (
    selected_variants.content_length >= 100 * 1024 * 1024 ||
    selected_variants.content_length > 25 * 1024 * 1024
  ) {
    await context.editOrReply({
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
    const fileName: string = `tiktokVideo-temp${Math.floor(Math.random() * 1000)}.mp4`;
    const downloadTikok = await downloadFile(selected_variants.href, fileName);
    try {
      const attachVideo = new AttachmentBuilder()
        .setName(fileName)
        .setFile("path", downloadTikok);

      await context.editOrReply({
        files: [attachVideo],
      });
    } catch (e) {
      client.logger.error(e);
      await context.editOrReply({
        embeds: [
          new AsepEmbed(
            {
              title: "Gagal dalam mengirim file video!",
              description: "Coba ulangi lagi dari beberapa saat!",
            },
            client,
          ).setType("error"),
        ],
      });
    } finally {
      if (existsSync(downloadTikok)) unlinkSync(downloadTikok);
    }
  }
};
