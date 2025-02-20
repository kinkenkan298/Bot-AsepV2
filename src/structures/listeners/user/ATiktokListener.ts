import { TiktokURLregex } from "#asep/structures/utils/data/Constants.js";
import { Message, UsingClient } from "seyfert";

export const ATiktokListener = async (
  message: Message,
  client: UsingClient,
) => {
  const { content } = message;
  const msg = content.toLowerCase();

  if (msg.startsWith("as!")) return;
  if (!TiktokURLregex.test(content)) return;
  message.reply({
    content: "ini link tiktok",
  });
};
