import { createWriteStream, existsSync, mkdirSync } from "fs";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { join } from "path";
import { fileURLToPath } from "url";

export default async function downloadFile(
  url: string,
  filename: string,
  paths?: string,
): Promise<string> {
  try {
    const PathToDir = paths ? paths : `${process.cwd()}/temp/`;
    if (!existsSync(PathToDir)) {
      mkdirSync(PathToDir);
    }
    const filePath = join(PathToDir, filename);
    const config: AxiosRequestConfig = {
      url,
      method: "GET",
      responseType: "stream",
    };
    const response: AxiosResponse = await axios(config);
    const writer = createWriteStream(filePath);

    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        writer.on("error", (e) => reject(e));
        writer.on("close", () => {
          resolve(filePath);
        });
      });
    });
  } catch (e) {
    console.error(e);
    throw Error("Error dalam mendownload file bang!");
  }
}
