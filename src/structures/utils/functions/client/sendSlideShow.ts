import type { ItemMedia } from "../../types/index.js";
import {
  AttachmentBuilder,
  CommandContext,
  Message,
  UsingClient,
} from "seyfert";
import downloadFile from "../downloadFile.js";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import { MessageFlags } from "seyfert/lib/types/index.js";
import {
  convertToProperCodec,
  getAudioData,
  sendVoiceMessage,
} from "./sendVoiceMessage.js";
import { writeFile } from "fs/promises";

export const sendSlideShow = async (
  items: ItemMedia[],
  client: UsingClient,
  context: CommandContext | Message,
) => {
  const isFromInteraction = context instanceof CommandContext;
  if (!isFromInteraction) {
    await client.messages.edit(context.id, context.channelId, {
      content: "⏳ Sedang Memprosess konten slide show...",
      allowed_mentions: { replied_user: false },
    });
  }
  const batchFile = 10;
  const tempPath: string[] = [];
  let nu: number = 0;

  const audio_item = items.find((fd) => fd.type === "audio");
  if (!audio_item) throw new Error("error guys");
  if (!audio_item.variants[0]) throw new Error("error gatau");

  const audio = await (await fetch(audio_item.variants[0].href)).arrayBuffer();
  const now = Date.now();
  if (!existsSync(`${process.cwd()}/temp/`))
    mkdirSync(`${process.cwd()}/temp/`);
  await writeFile(`${process.cwd()}/temp/${now}-audio.mp4`, Buffer.from(audio));
  const ogg_filename = await convertToProperCodec(
    `${process.cwd()}/temp/${now}-audio.mp4`,
  );
  const { duration, waveform } = await getAudioData(ogg_filename);

  for (let i = 0; i < items.length; i += batchFile) {
    const batch = items.slice(i, i + batchFile);
    const image_path: AttachmentBuilder[] = [];
    for (const item of batch) {
      if (!items[0].variants) throw new Error("Error tidak diketahui!");
      let fileName: string;
      if (item.type !== "image") continue;
      fileName = `Image${Math.floor(Math.random() * 1000)}-temp.jpg`;
      const downFile = await downloadFile(item.variants[0].href, fileName);
      tempPath.push(downFile);
      image_path.push(
        new AttachmentBuilder({
          filename: fileName,
          resolvable: downFile,
          type: "path",
        }),
      );
    }

    if (isFromInteraction) {
      await context.interaction?.followup({
        files: image_path,
      });
    } else {
      if (!context.referencedMessage) throw new Error("tidak tahu");
      try {
        await client.messages.edit(
          context.referencedMessage.id,
          context.channelId,
          {
            flags: MessageFlags.SuppressEmbeds,
          },
        );
      } catch (e) {
        client.logger.error(e);
      }
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
  tempPath.push(`${process.cwd()}/temp/${now}-audio.mp4`);
  tempPath.push(ogg_filename);

  await sendVoiceMessage(context.channelId, ogg_filename, duration, waveform);

  setTimeout(() => {
    for (const pth of tempPath) {
      if (existsSync(pth)) unlinkSync(pth);
    }
  }, 2000);
};
