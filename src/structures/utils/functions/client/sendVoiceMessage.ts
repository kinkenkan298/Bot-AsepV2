import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import axios from "node_modules/axios/index.cjs";
import { Message } from "seyfert";

export async function convertToProperCodec(
  path_audio: string,
): Promise<string> {
  await new Promise<void>((resolve) => {
    execFile(
      "ffmpeg",
      ["-i", path_audio, "-c:a", "libopus", "-vn", `${path_audio}.ogg`],
      {
        encoding: "utf-8",
        shell: true,
      },
      (err, stdout, stderr) => {
        if (err) {
          console.error(stdout, stderr);
          throw new Error(
            "gagal menjalankan ffmpeg! tolong periksa ulang ffmpeg!",
          );
        }
        resolve();
      },
    );
  });
  return `${path_audio}.ogg`;
}

export async function getAudioData(path_audio: string) {
  await new Promise<void>((resolve) => {
    execFile(
      "ffmpeg",
      [
        "-i",
        path_audio,
        "-f",
        "u8",
        "-ac",
        "1",
        "-ar",
        "1000",
        `${path_audio}.raw`,
      ],
      { encoding: "utf-8", shell: true },
      (err, stdout, stderr) => {
        if (err) {
          console.error(stdout, stderr);
          throw new Error(
            "gagal menjalankan ffmpeg! tolong periksa ulang ffmpeg nya!",
          );
        }
        resolve();
      },
    );
  });

  const data = Array.from(await readFile(`${path_audio}.raw`));
  const durations = data.length / 1000;

  let waveform_samples = 1 + Math.floor(data.length / 100);
  if (waveform_samples > 250) waveform_samples = 256;

  const sample_after = Math.floor(data.length / (waveform_samples - 1));
  const waveform = new Uint8Array(waveform_samples);

  for (let i = 0; i < waveform_samples; i++) {
    const el = data[i + sample_after];
    if (!el) throw new Error("error waveform nya!");
    waveform[i] = volume(el);
  }

  return { duration: durations, waveform: waveform };
}

function volume(byte: number) {
  if (byte >= 0x80) {
    return (byte - 0x80) * 2;
  } else {
    return (0x80 - byte) * 2;
  }
}

export async function sendVoiceMessage(
  channelId: string,
  path_audio: string,
  waveform: Uint8Array,
  duration: number,
) {
  const data = await readFile(path_audio);
  const form = new FormData();
  form.append("files[0]", new Blob([data], { type: "audio/ogg" }), "song.ogg");

  const payload_json = {
    attachments: [
      {
        id: "0",
        filename: "song.ogg",
        duration_sec: duration,
        waveform: Buffer.from(waveform).toString("base64"),
      },
    ],
    flags: 1 << 13,
  };

  form.append("payload_json", JSON.stringify(payload_json));

  const DISCORD_URI = `https://discord.com/api/v10/channels/${channelId}/messages`;
  const resp = await axios({
    method: "POST",
    url: DISCORD_URI,
    headers: {
      Authorization: `Bot ${process.env.TOKEN_DISCORD}`,
    },
    data: {
      body: form,
    },
  });
  if (resp.statusText !== "OK")
    throw new Error("Gagal mengirim pesan voice di discord!");
  return resp.data as Message;
}
