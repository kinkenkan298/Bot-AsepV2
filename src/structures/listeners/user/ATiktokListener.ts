import { sendSingleVideo } from "#asep/structures/utils/functions/index.js";
import {
  getContent,
  SearchForTask,
} from "#asep/structures/utils/functions/utils.js";
import type { ItemVideo } from "#asep/structures/utils/types/index.js";
import { Message, UsingClient } from "seyfert";

export const ATiktokListener = async (
  message: Message,
  client: UsingClient,
) => {
  const { content, channelId, id } = message;

  const task = SearchForTask(content);
  if (task === null) return;
  const status_message = await client.messages.write(channelId, {
    content: `⏳ Analisis konten dari link ${task.type} ....`,
    allowed_mentions: {
      replied_user: false,
    },
    message_reference: {
      message_id: id,
      fail_if_not_exists: false,
    },
  });

  let items: Array<ItemVideo>;
  try {
    items = await getContent(task);
  } catch (e: any) {
    client.logger.error(e);
    return;
  }
  if (!items[0]) throw new Error("Tidak ada item");

  await sendSingleVideo(items[0], client, status_message);

  const updateStatus = async (text: string) => {
    await client.messages.edit(status_message.id, status_message.channelId, {
      content: text,
      allowed_mentions: { replied_user: false },
    });
  };
};
