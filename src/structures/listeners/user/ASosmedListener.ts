import { sendSlideShow } from "#asep/structures/utils/functions/client/sendSlideShow.js";
import downloadFile from "#asep/structures/utils/functions/downloadFile.js";
import { sendSingleVideo } from "#asep/structures/utils/functions/index.js";
import {
  getContent,
  SearchForTask,
} from "#asep/structures/utils/functions/utils.js";
import type { ItemMedia } from "#asep/structures/utils/types/index.js";
import { AttachmentBuilder, Message, UsingClient } from "seyfert";

export const ASosmedListener = async (
  message: Message,
  client: UsingClient,
) => {
  const { content, channelId, id } = message;

  const prefix: string[] = [
    ...client.config.prefixes,
    ...client.config.defaultPrefix,
  ];
  for (const pref of prefix) {
    if (content.startsWith(pref)) return;
  }

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

  let items: Array<ItemMedia>;
  try {
    items = await getContent(task);
  } catch (e: any) {
    client.logger.error(e);
    return;
  }
  if (!items[0]) throw new Error("Tidak ada item");

  if (items.length > 1 && items[0].type === "image") {
    await sendSlideShow(items, client, status_message);
  } else if (items.length === 1 && items[0].type === "video") {
    await sendSingleVideo(items[0], client, status_message);
  } else {
    await updateStatus("⏳ Sedang Memprosess konten ...");

    const files: AttachmentBuilder[] = [];
    for (const item of items) {
      if (item.variants[0] === null)
        throw new Error("Terjadi kesalahan tidak terduga!");
      if (
        item.variants[0]?.content_length > 25 * 1024 * 1024 ||
        item.variants[0].content_length >= 100 * 1024 * 1024
      ) {
        await updateStatus(
          "❌ File berukuran terlalu besar tidak dapat dikirim!",
        );
      } else if (
        item.type === "video" &&
        item.variants[0].content_length < 25 * 1024 * 1024
      ) {
        const fileName = `video${Math.floor(Math.random() * 1000)}-temp.mp4`;
        const downVideo = await downloadFile(item.variants[0].href, fileName);
        files.push(
          new AttachmentBuilder({
            filename: fileName,
            type: "path",
            resolvable: downVideo,
            description: "File video",
          }),
        );
      } else {
        let fileName: string;
        let downFile;
        switch (item.type) {
          case "video": {
            fileName = `video${Math.floor(Math.random() * 1000)}-temp.mp4`;
            downFile = await downloadFile(item.variants[0].href, fileName);

            break;
          }
          case "image": {
            fileName = `video${Math.floor(Math.random() * 1000)}-temp.mp4`;
            downFile = await downloadFile(item.variants[0].href, fileName);
            break;
          }
          case "audio": {
            fileName = `video${Math.floor(Math.random() * 1000)}-temp.mp4`;
            downFile = await downloadFile(item.variants[0].href, fileName);
            break;
          }
        }

        files.push(
          new AttachmentBuilder({
            filename: fileName,
            type: "path",
            resolvable: downFile,
            description: "File video",
          }),
        );
      }
    }
    updateStatus("⏳ Upload konten ke discord ...");
    await client.messages.edit(status_message.id, status_message.channelId, {
      content: "✅ Berhasil upload!",
      files: files,
      allowed_mentions: { replied_user: false },
    });
  }

  async function updateStatus(text: string) {
    await client.messages.edit(status_message.id, status_message.channelId, {
      content: text,
      allowed_mentions: { replied_user: false },
    });
  }
};
