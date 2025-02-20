import { Downloader } from "@tobyg74/tiktok-api-dl";
import { ItemVideo, Variants } from "#asep/types";
import { validateAndGetContentLength } from "../utils.js";
export const extractTiktok = async (url: string) => {
  return scrapperTiktok(url);
};
async function scrapperTiktok(url: string): Promise<Array<ItemVideo>> {
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

        const video_info = await validateAndGetContentLength(urlAPI);
        variants.push({
          href: urlAPI,
          content_length: video_info.content_length,
          file_extenstion: video_info.file_extension,
        });

        return [{ type: "video", variants: variants }];
      }
      case "image": {
        if (!result.images)
          throw new Error("Terjadi kesalahan dalam mendownload gambar!");
        const resultImages = [];
        for (const image of result.images) {
          const image_info = await validateAndGetContentLength(image);
          const item: ItemVideo = {
            type: "image",
            variants: [
              {
                href: image,
                content_length: image_info.content_length,
                file_extenstion: image_info.file_extension,
                image_width: image_info.image_width,
                image_height: image_info.image_height,
              },
            ],
          };
          resultImages.push(item);
        }
        const audio_info = await validateAndGetContentLength(
          result?.music?.playUrl[0],
        );
        const item: ItemVideo = {
          type: "audio",
          variants: [
            {
              href: result?.music?.playUrl[0],
              content_length: audio_info.content_length,
              file_extenstion: audio_info.file_extension,
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
