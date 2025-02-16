import { createWriteStream, existsSync, mkdirSync } from "fs";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { join } from "path/posix";

export default async function downloadFile(
  url: string,
  filename: string,
  paths?: string,
): Promise<string> {
  try {
    const PathToDir = paths ? paths : `${__dirname}../../../../../temp/`;
    if (!existsSync(PathToDir)) {
      mkdirSync(PathToDir, { recursive: true });
    }
    const filePath = join(PathToDir, filename);
    const config: AxiosRequestConfig = {
      method: "GET",
      responseType: "stream",
    };
    const response: AxiosResponse = await axios(url, config);
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
