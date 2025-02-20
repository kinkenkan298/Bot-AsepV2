import type { Task } from "#asep/structures/utils/types/index.js";
import { Message, UsingClient } from "seyfert";

export const ATiktokListener = async (
  message: Message,
  client: UsingClient,
) => {
  const { content } = message;
  const msg = content.toLowerCase();

  const task = SearchForTask(msg);
  if (task === null) return;

  message.reply({
    content: "ini link tiktok",
  });
};

const getContent = (task: Task) => {
  switch (task.type) {
    case "Tiktok": {
      console.log("tiktok");
      break;
    }
    case "Youtube": {
      console.log("ig");
      break;
    }
    case "Instagram": {
      console.log("ha");
      break;
    }
  }
};

const SearchForTask = (text: string): Task | null => {
  const hrefs = text.match(/(?:https:\/\/|http:\/\/)\S+/gm);
  if (hrefs === null) return null;
  const urls = new Array<URL>();
  for (const el of hrefs) {
    urls.push(new URL(el));
  }

  for (const url of urls) {
    if (url.hostname.endsWith("tiktok.com")) {
      return {
        href: url.href,
        type: "Tiktok",
      };
    }
  }
  return null;
};
