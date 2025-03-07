import axios from "axios";
import { ItemMedia, Variants } from "../../types/index.js";
import { validateAndGetContentLength } from "../utils.js";

const FIXED_TIMESTAMP = 1739185749634;
const SECRECT_KEY =
  "46e9243172efe7ed14fa58a98949d9e3a6cc7ec3aa0ae5d21c1654e507de884c";
const BASE_URL = "https://instasupersave.com";
const URL_MSEC = "/msec";
const URL_CONVERT = "/api/convert";
const headers: Record<string, string> = {
  authority: "instasupersave.com",
  accept: "*/*",
  "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
  "content-type": "application/json",
  origin: "https://instasupersave.com",
  referer: "https://instasupersave.com/en/",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
};

export const extractInstagram = (url: string) => {
  return scrapperInstagram(url);
};

const scrapperInstagram = async (url: string): Promise<Array<ItemMedia>> => {
  const signature = await getSignature(url);

  const req = await axios({
    method: "POST",
    headers,
    url: BASE_URL + URL_CONVERT,
    data: JSON.stringify(signature),
  });
  if (req.status !== 200 || req.statusText !== "OK")
    throw new Error("Gagal dalam scrape data instagram !");

  const data = req.data;
  if (Array.isArray(data)) {
    const result: ItemMedia[] = [];
    for (const urlMedia of data) {
      for (const urla of urlMedia.url) {
        const imageInfo = await validateAndGetContentLength(urla.url);
        const item: ItemMedia = {
          type: "image",
          variants: [
            {
              href: urla.url,
              content_length: imageInfo.content_length,
            },
          ],
        };
        result.push(item);
      }
    }
    return result;
  } else {
    const variants: Variants[] = [];
    for (const urlv of data.url) {
      const videoInfo = await validateAndGetContentLength(urlv.url);
      variants.push({
        href: urlv.url,
        content_length: videoInfo.content_length,
      });
    }

    return [
      {
        type: "video",
        variants: variants,
      },
    ];
  }
};

const getSignature = async (input: string | object) => {
  const req = await axios({
    method: "GET",
    headers,
    url: BASE_URL + URL_MSEC,
  });
  if (req.status !== 200 || req.statusText !== "OK")
    throw new Error("Terjadi kesalahan tidak terduga!");

  const { msec } = req.data;

  let serverTime = Math.floor(msec * 1000);
  let timeDiff = serverTime ? Date.now() - serverTime : 0;
  if (Math.abs(timeDiff) < 60000) {
    timeDiff = 0;
  }

  const timestamp = Date.now() - timeDiff;
  const payload =
    typeof input === "string" ? input : JSON.stringify(sortObject(input));
  const digest = `${payload}${timestamp}${SECRECT_KEY}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(digest);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return {
    url: input,
    ts: timestamp,
    _ts: FIXED_TIMESTAMP,
    _tsc: timeDiff,
    _s: signature,
  };
};

const sortObject = async (obj: object): Promise<Object> => {
  return Object.keys(obj)
    .sort()
    .reduce((rslt, key) => {
      // @ts-ignore
      rslt[key] = obj[key];
      return rslt;
    }, {});
};
