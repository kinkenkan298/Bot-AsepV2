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
    const result = fetchAPI?.result;
    switch (result.type) {
      case "video": {
        const variants: Variants[] = [];
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
        const variants: Variants[] = [];
        variants.push({
          uri_path: "hai",
          content_length: 28,
        });
        return [{ type: "image", variants: variants }];
      }
    }
  } catch (e) {
    console.error(e);
    throw new Error("Error tidak di ketahui");
  }
}
