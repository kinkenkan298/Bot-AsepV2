import { instagramdl } from "@bochilteam/scraper";
import { Variants } from "../../types/index.js";
import { validateAndGetContentLength } from "../utils.js";

async function scrapperInstagram(url: string) {
  try {
    const fetchAPI = await instagramdl(url);
    const variants: Variants[] = [];
    console.log(fetchAPI);
  } catch (e) {
    console.error(e);
    throw new Error("Terjadi kesalahan dalam fetch data!!");
  }
}
