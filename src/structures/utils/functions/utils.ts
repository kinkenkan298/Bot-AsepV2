import { head } from "node_modules/axios/index.cjs";
import { AnyContext } from "seyfert";

export const sliceText = (text: string, max: number = 100) =>
  text.length > max ? `${text.slice(0, max)}...` : max;

export const getCollectionKey = (ctx: AnyContext): string => {
  const authorId = ctx.author.id;
  if (ctx.isChat() || ctx.isMenu() || ctx.isEntryPoint())
    return `${authorId}-${ctx.fullCommandName}-command`;
  if (ctx.isComponent() || ctx.isModal())
    return `${authorId}-${ctx.customId}-component`;

  return `${authorId}-all`;
};
export function splitTextByAmount(
  text: string,
  amount: number,
  character = "\n",
): Array<string> {
  const parts: Array<string> = [];

  if (character) {
    const split = text.split(character);
    if (split.length === 1) {
      return split;
    }
    while (split.length) {
      let newText: string = "";
      while (newText.length < amount && split.length) {
        const part = split.shift()!;
        if (part) {
          if (amount < newText.length + part.length + 2) {
            split.unshift(part);
            break;
          }
          newText += part + "\n";
        }
      }
      parts.push(newText);
    }
  } else {
    while (text.length) {
      parts.push(text.slice(0, amount));
      text = text.slice(amount);
    }
  }
  return parts;
}
export const validateAndGetContentLength = async (url: string) => {
  for (let i = 3; i >= 1; i--) {
    let response = await fetch(url, { method: "HEAD" });
    if (!response.ok && i === 1)
      throw new Error("Terjadi kesalahan pada request ke Server!");

    let content_length = getContentLength(response.headers);
    if (response.status === 405) {
      const allows = response.headers.get("allow");
      if (allows !== null)
        if (allows.includes("GET")) {
          content_length = undefined;
        }
    }

    if (!content_length) {
      response = await fetch(url);
      content_length = getContentLength(response.headers);
    }

    if (!content_length)
      throw new Error("Tidak ada content length yang tersedia");
    let file_extension;
    let header_value = response.headers.get("content-type");
    if (header_value != null) {
      if (header_value.startsWith("video/")) {
        file_extension = header_value.slice("video/".length);
      }
      if (header_value.startsWith("image/")) {
        file_extension = header_value.slice("image/".length);
      }
      if (header_value.startsWith("audio/")) {
        file_extension = header_value.slice("audio/".length);
      }
    }

    let width_value: number | undefined;
    let height_value: number | undefined;
    header_value = response.headers.get("x-imagex-extra");
    if (header_value != null) {
      width_value = JSON.parse(header_value).enc.w;
      height_value = JSON.parse(header_value).enc.h;
    }
    return {
      content_length: content_length,
      image_width: width_value,
      image_height: height_value,
      file_extension: file_extension,
    };
  }
  throw new Error("Tidak ada content yang ditemukan!");
};
const getContentLength = (head: Headers) => {
  let headers_value = head.get("content-length");
  console.log(headers_value);
  if (headers_value != null) {
    return Number.parseInt(headers_value);
  }
  headers_value = head.get("Content-Length");
  if (headers_value != null) {
    return Number.parseInt(headers_value);
  }
  return undefined;
};
