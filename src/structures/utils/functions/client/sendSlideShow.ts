import type { ItemMedia } from "../../types/index.js";
import {
  AttachmentBuilder,
  CommandContext,
  Message,
  UsingClient,
} from "seyfert";
import downloadFile from "../downloadFile.js";
import { existsSync, unlinkSync } from "fs";
import { MessageFlags } from "seyfert/lib/types/index.js";

export const sendSlideShow = async (
  items: ItemMedia[],
  client: UsingClient,
  context: CommandContext | Message,
) => {
  const isFromInteraction = context instanceof CommandContext;
  if (!isFromInteraction) {
    await client.messages.edit(context.id, context.channelId, {
      content: "⏳ Sedang Memprosess konten ...",
      allowed_mentions: { replied_user: false },
    });
    if (!context.referencedMessage) throw new Error("tidak tahu");
    try {
      await client.messages.edit(
        context.referencedMessage.id,
        context.channelId,
        {
          flags: MessageFlags.SuppressEmbeds,
        },
      );
    } catch (e) {}
  }
  const batchFile = 10;
  const tempPath: string[] = [];
  let nu: number = 0;

  for (let i = 0; i < items.length; i += batchFile) {
    const batch = items.slice(i, i + batchFile);
    const image_path: AttachmentBuilder[] = [];
    for (const item of batch) {
      if (!items[0].variants) throw new Error("Error tidak diketahui!");
      let fileName: string;
      if (item.type === "image") {
        fileName = `tiktokImage-${Math.floor(Math.random() * 1000)}-temp.jpg`;
      } else {
        fileName = `tiktokAudio-${Math.floor(Math.random() * 1000)}-temp.mp3`;
      }
      const downFile = await downloadFile(item.variants[0].href, fileName);
      tempPath.push(downFile);
      image_path.push(
        new AttachmentBuilder().setName(fileName).setFile("path", downFile),
      );
    }

    if (isFromInteraction) {
      await context.interaction?.followup({
        files: image_path,
      });
    } else {
      if (nu == 0) {
        await client.messages.edit(context.id, context.channelId, {
          content: "✅ Berhasil upload!",
          files: image_path,
          allowed_mentions: { replied_user: false },
        });
        nu = nu + 1;
      } else {
        await client.messages.write(context.channelId, {
          files: image_path,
          allowed_mentions: { replied_user: false },
        });
      }
    }
  }
  setTimeout(() => {
    for (const pth of tempPath) {
      if (existsSync(pth)) unlinkSync(pth);
    }
  }, 5000);
};
