import downloadFile from "#asep/structures/utils/functions/downloadFile.js";
import { Downloader } from "@tobyg74/tiktok-api-dl";
import { statSync } from "fs";
import { ItemVideo, Variants } from "../types/atiktok/ATiktok.js";
export async function scrapperTiktok(url: string): Promise<Array<ItemVideo>> {
  try {
    const fetchAPI = await Downloader(url, { version: "v1" });
    if (!fetchAPI.result || fetchAPI.status === "error") {
      throw new Error("Terjadi kesalahan dalam fetch API!");
    }
    const variants: Variants[] = [];
    const result = fetchAPI?.result;
    switch (result.type) {
      case "video": {
        const urlAPI =
          result.video?.playAddr[0] ||
          result.video?.playAddr[1] ||
          result.video?.playAddr[2];
        if (!urlAPI)
          throw new Error("URL API tidak dapat ditemukan tolong periksa lagi!");
        const fileName = `tiktok-${Math.round(Math.random() * 1000)}-temp.mp4`;
        const filePath = await downloadFile(urlAPI, fileName);
        const size = statSync(filePath).size;
        variants.push({
          uri_path: filePath,
          content_length: size,
          file_name: fileName,
          music: result?.music.playUrl,
        });
        return [{ type: "video", variants: variants }];
      }
      case "image": {
        if (!result.images)
          throw new Error("Terjadi kesalahan dalam mendownload gambar!");
        const resultImages = [];
        for (const image of result.images) {
          const fileName = `tiktok-${Math.round(Math.random() * 1000)}-temp.jpg`;
          const filePath = await downloadFile(image, fileName);
          const size = statSync(filePath).size;
          const item: ItemVideo = {
            type: "image",
            variants: [
              {
                uri_path: filePath,
                content_length: size,
                file_name: fileName,
              },
            ],
          };
          resultImages.push(item);
        }
        const fileName = `audio-${Math.floor(Math.random() * 1000)}.mp3`;
        const audioPath = await downloadFile(
          result?.music?.playUrl[0],
          fileName,
        );
        const size = statSync(audioPath).size;
        const item: ItemVideo = {
          type: "audio",
          variants: [
            {
              uri_path: audioPath,
              content_length: size,
              music: result?.music.playUrl,
              file_name: fileName,
            },
          ],
        };
        resultImages.push(item);
        return resultImages;
      }
    }
  } catch (e) {
    console.error(e);
    throw new Error("Error tidak di ketahui");
  }
}
