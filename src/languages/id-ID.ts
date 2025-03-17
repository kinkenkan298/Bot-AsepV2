import {
  AsepCategory,
  PermissionNames,
} from "#asep/structures/utils/types/index.js";
import { ApplicationCommandOptionType } from "seyfert/lib/types/index.js";

type IMention = {
  clientName: string;
  defaultPrefix: string;
  commandName: string;
};
type IHelp = { defaultPrefix: string; options: string };
type IHelpMenu = { category: string };
type IHelpMenuEmbed = Pick<IMention, "clientName"> & IHelpMenu;
type IPrefix = { prefix: string };
type TOptions = { options: string; list: string };
type ICooldown = { time: number };
type IUser = { userId: string };
type IChannel = { channelId: string };

export default {
  metadata: {
    name: "Indonesia",
    emoji: "🇮🇩",
    translator: ["Kishin"],
  },
  messages: {
    commands: {
      help: {
        noCommand: "`❌` **Tidak ada perintah** yang ditemukan  ...",
        title: ({ clientName }: Pick<IMention, "clientName">) =>
          `${clientName} - Menu bantu!`,
        description: ({ defaultPrefix }: Pick<IHelp, "defaultPrefix">) =>
          `\`📦\` Haloo! Ini Adalah informasi dari menu perintah saya.\n\`📜\` Silakan pilih perintah category menu\n\n#- Kamu juga bisa cari secara spesifik dengan mengetik: \`${defaultPrefix}help <command> \``,
        selectMenu: {
          description: ({ category }: IHelpMenu) =>
            `Pilih perintah menu category ${category}`,
          placeholder: "Silakan pilih perintah menu category",
          options: {
            description: ({ options }: Pick<IHelp, "options">) =>
              `-# **Opsional []**\n-# **Dibutuhkan <>**\n${options}`,
            title: ({ clientName, category }: IHelpMenuEmbed) =>
              `${clientName} - Menu bantu! | ${category}`,
          },
        },
        aliases: {
          [AsepCategory.Unknown]: "Tidak tahu",
          [AsepCategory.Guild]: "Guild",
          [AsepCategory.User]: "User",
          [AsepCategory.Music]: "Musik",
        } satisfies Record<AsepCategory, string>,
      },
      autorespon: {
        embed: {
          title: "Konfigurasi Autoresponder!",
          description:
            "Setting autoresponder guild kamu !\nAgar guild lebih interaktif!",
        },
        buttons: {
          add: "Tambah Pesan otomatis!",
          list: "Daftar Pesan otomatis!",
          delete: "Hapus Pesan otomatis!",
          delete_all: "Hapus Semua Pesan otomatis!",
          stop: "Berhenti Konfigurasi!",
        },
      },
    },
    events: {
      inCooldown: ({ time }: ICooldown) =>
        `Kamu perlu menunggu <t:${time}:R> (<t:${time}:t>) untuk menggunakan nya lagi!`,
      invalidOptions: ({ options, list }: TOptions) =>
        `\`❌\` Opsi atau parameter yang diterima salah !.\n-# - **Dibutuhkan**: \`<>\`\n-# - **Optional**: \`[]\`\n\n\`📋\` **Cara pakai**:\n ${options}\n\`📢\` **Opsi yang tersedia!**:\n${list}`,
      noCollector: ({ userId }: IUser) =>
        `\`❌\` Hanya user <@${userId}> yang boleh memakai ini!`,
      onlyDeveloper:
        "`❌` Hanya **developer bot** yang boleh memakai perintah ini!",
      onlyGuildOwner:
        "`❌` Hanya **Pemilik Guild** yang boleh memakai perintah ini!",
      commandsError:
        "`❌` Terjadi kesalahan ketika menjalankan perintah!\n`📢` Jika anda tau masalah nya, Tolong beritahu Pembuat!",
      optionTypes: {
        [ApplicationCommandOptionType.Subcommand]: "subcommand",
        [ApplicationCommandOptionType.SubcommandGroup]: "subcommand group",
        [ApplicationCommandOptionType.String]: "string",
        [ApplicationCommandOptionType.Integer]: "integer",
        [ApplicationCommandOptionType.Boolean]: "boolean",
        [ApplicationCommandOptionType.User]: "@user",
        [ApplicationCommandOptionType.Channel]: "#channel",
        [ApplicationCommandOptionType.Role]: "@role",
        [ApplicationCommandOptionType.Mentionable]: "@mentionable",
        [ApplicationCommandOptionType.Number]: "number",
        [ApplicationCommandOptionType.Attachment]: "attachment",
      } satisfies Record<ApplicationCommandOptionType, string>,
      permissions: {
        list: {
          AddReactions: "Tambah reaksi",
          Administrator: "Administrasi",
          AttachFiles: "Lampiran berkas",
          BanMembers: "Larang Anggota",
          ChangeNickname: "Ganti NickName",
          Connect: "Koneksi",
          CreateInstantInvite: "Buat link invite",
          CreatePrivateThreads: "Buat Private Threads",
          CreatePublicThreads: "Buat Public Threads",
          DeafenMembers: "Mute Anggota",
          EmbedLinks: "Links Embed",
          KickMembers: "Tendang Anggota",
          ManageChannels: "Mengatur Saluran",
          ManageEvents: "Atur Peristiwa",
          ManageGuild: "Atur server",
          ManageMessages: "Atur pesan",
          ManageNicknames: "Atur Nickname",
          ManageRoles: "Atur Role",
          ManageThreads: "Atur Threads",
          ManageWebhooks: "Atur Webhooks",
          MentionEveryone: "Tag semua orang",
          ModerateMembers: "Hukum Anggota",
          MoveMembers: "Pindah Anggota",
          MuteMembers: "Bisukan Anggota",
          PrioritySpeaker: "Priority Speaker",
          ReadMessageHistory: "Baca Sejarah Pesan",
          RequestToSpeak: "Request To Speak",
          SendMessages: "Kirim Pesan",
          SendMessagesInThreads: "Send Messages In Threads",
          SendTTSMessages: "Send TTS Messages",
          Speak: "Speak",
          Stream: "Stream",
          UseApplicationCommands: "Use Application Commands",
          UseEmbeddedActivities: "Use Activities",
          UseExternalEmojis: "Use External Emojis",
          UseExternalStickers: "Use External Stickers",
          UseVAD: "Use VAD",
          ViewAuditLog: "View Audit Logs",
          ViewChannel: "View Channel",
          ViewGuildInsights: "View Guild Insights",
          ManageGuildExpressions: "Manage Guild Expressions",
          ViewCreatorMonetizationAnalytics:
            "View Creator Monetization Analytics",
          UseSoundboard: "Use Sound Board",
          UseExternalSounds: "Use External Sounds",
          SendVoiceMessages: "Send Voice Messages",
          CreateEvents: "Create Events",
          CreateGuildExpressions: "Create Guild Expressions",
          SendPolls: "Send Polls",
          UseExternalApps: "Use External Apps",
        } satisfies Record<PermissionNames, string>,
        user: {
          description: "`📢` Heyy, kamu perlu izin untuk menggunakan ini !",
          field: "`📋` Perlu izin !",
        },
        bot: {
          description: "`📢` Hey, Aku perlu izin ini untuk melakukan nya!",
          field: "`📋` Perizinan",
        },
        channel: {
          description: ({ channelId }: IChannel) =>
            `\`📢\` Hey, aku perlu izin di channel ini. <#${channelId}>`,
          field: "`📋` Perlu izin !",
        },
      },
    },
  },
  languages: {
    ping: {
      name: "ping",
      description: "Dapatkan Bot Asep Ping!",
    },
    translate: {
      name: "translate",
      description: "Ubah bahasa mu ke bahasa yang diinginkan!",
      option: {
        name: "to",
        description: "Negara Tujuan ubah bahasa!",
      },
    },
    autorespon: {
      name: "autorespon",
      description: "Buat Pesan otomatis agar guild lebih interaktif!",
    },
  },
};
