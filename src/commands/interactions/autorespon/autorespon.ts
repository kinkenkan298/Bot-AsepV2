import autoresponModel from "#asep/structures/schemas/guilds/AutoresponModel.js";
import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { AsepOptions } from "#asep/structures/utils/Decorators.js";
import { AsepCategory } from "#asep/structures/utils/types/index.js";
import {
  ActionRow,
  Button,
  Command,
  type CommandContext,
  Declare,
  Formatter,
  LocalesT,
  Modal,
  SelectMenu,
  StringSelectMenu,
} from "seyfert";
import {
  ButtonStyle,
  ComponentType,
  MessageFlags,
  TextInputStyle,
} from "seyfert/lib/types/index.js";

@Declare({
  name: "autorespon",
  description: "bikin pesan otomatis pada guild",
  contexts: ["Guild"],
  defaultMemberPermissions: ["ManageGuild", "Administrator"],
})
@AsepOptions({ cooldown: 10, category: AsepCategory.Guild })
@LocalesT("languages.autorespon.name", "languages.autorespon.description")
export default class AutoresponCommand extends Command {
  public override async run(ctx: CommandContext) {
    const { client, guildId } = ctx;

    await ctx.deferReply();

    const { messages } = await ctx.getLocale();

    const embed = new AsepEmbed(
      {
        title: messages.commands.autorespon.embed.title,
        description: messages.commands.autorespon.embed.description,
      },
      client,
    ).setType("info");
    const buttonRow = [
      new ActionRow<Button>().setComponents([
        new Button({
          custom_id: "create_autorespon",
          label: messages.commands.autorespon.buttons.add,
          style: ButtonStyle.Success,
        }),
        new Button({
          custom_id: "list_autorespon",
          label: messages.commands.autorespon.buttons.list,
          style: ButtonStyle.Primary,
        }),
        new Button({
          custom_id: "delete_autorespon",
          label: messages.commands.autorespon.buttons.delete,
          style: ButtonStyle.Danger,
        }),
      ]),
      new ActionRow<Button>().setComponents([
        new Button({
          custom_id: "delete_all_autorespon",
          label: messages.commands.autorespon.buttons.delete_all,
          style: ButtonStyle.Secondary,
        }),
        new Button({
          custom_id: "stopevent_autorespon",
          label: messages.commands.autorespon.buttons.stop,
          style: ButtonStyle.Danger,
        }),
      ]),
    ];

    const message = await ctx.editOrReply(
      {
        embeds: [embed],
        components: buttonRow,
      },
      true,
    );

    const collector = message.createComponentCollector({
      filter: (i) => i.user.id === ctx.author.id,
      onPass: async (interaction) => {
        await interaction.write({
          flags: MessageFlags.Ephemeral,
          embeds: [
            {
              description: messages.events.noCollector({
                userId: ctx.author.id,
              }),
              color: client.config.colors.errors,
            },
          ],
        });
      },
      onStop: async (reason) => {
        if (reason === "idle") {
          const components: ActionRow<Button>[] = message!.components.map(
            (component) => {
              new ActionRow({
                components: component.components.map((row) => {
                  row.data.disabled = true;
                  return row.toJSON();
                }),
              });
            },
          );
          await client.messages.edit(ctx.message!.id, ctx.channelId, {
            components,
          });
        }
      },
      idle: 60e3,
    });
    collector.run("stopevent_autorespon", async (i) => {
      if (!i.isButton()) return;
      await i.update({
        embeds: [
          embed
            .setTitle("Stop Konfigurasi!!")
            .setDescription("Berhasil stop konfigurasi autoresponder!")
            .setType("error"),
        ],
        components: [],
      });
      collector.stop("stop");
    });

    collector.run("create_autorespon", async (i) => {
      if (!i.isButton()) return;
      const modal = new Modal({
        custom_id: "createModal_autorespon",
        title: "Tambah Autoresponder!",
        components: [
          {
            components: [
              {
                required: true,
                label: "Trigger pesan!",
                placeholder: "trigger pesan ....",
                type: ComponentType.TextInput,
                style: TextInputStyle.Short,
                custom_id: "trigger_autorespon",
              },
            ],
            type: ComponentType.ActionRow,
          },
          {
            components: [
              {
                required: true,
                label: "Respon balasan pesan!",
                placeholder: "respon balesan ....",
                type: ComponentType.TextInput,
                style: TextInputStyle.Paragraph,
                custom_id: "response_autorespon",
              },
            ],
            type: ComponentType.ActionRow,
          },
        ],
      });

      await i.modal(modal);
    });
    collector.run("delete_autorespon", async (i) => {
      if (!i.isButton()) return;
      const modal = new Modal({
        custom_id: "deleteModal_autorespon",
        title: "Tambah Autoresponder!",
        components: [
          {
            components: [
              {
                required: true,
                label: "Trigger pesan!",
                placeholder: "trigger pesan ....",
                type: ComponentType.TextInput,
                style: TextInputStyle.Short,
                custom_id: "trigger_autorespon",
              },
            ],
            type: ComponentType.ActionRow,
          },
        ],
      });

      await i.modal(modal);
    });

    collector.run("list_autorespon", async (i) => {
      if (!i.isButton()) return;
      const embed = new AsepEmbed(
        {
          title: "Konfigurasi Autoresponder!",
          description: "Berikut ini list pesan otomatis yang ada di guild!",
        },
        client,
      ).setType("info");

      try {
        const data = await autoresponModel.findOne({ guildId });
        if (!data || data.autorespon.length === 0 || !data.autorespon) {
          await i.editOrReply({
            embeds: [
              new AsepEmbed(
                {
                  title: "Tidak ada pesan otomatis!!!",
                  description: "Silakan tambah data pesan dulu!",
                },
                client,
              ).setType("error"),
            ],
            flags: MessageFlags.Ephemeral,
          });
          return;
        }
        const fields: Array<{ name: string; value: string }> = [];
        data.autorespon.forEach(
          (d: { pesan: string; balesan: string }, i: number) => {
            fields.push({
              name: `${Formatter.underline("Pesan")}  ${i + 1}`,
              value: `Pesan: ${d.pesan}\nBalesan: ${d.balesan}`,
            });
          },
        );
        await i.update({
          embeds: [
            embed
              .addFields(fields)
              .setTitle("Berikut ini list pesan otomatis nya!"),
          ],
        });
      } catch (e) {
        client.logger.error(e);
        await i.editOrReply({
          embeds: [
            new AsepEmbed(
              {
                title: "Terjadi kesalahan dalam query database!",
              },
              client,
            ).setType("error"),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }
    });
    collector.run("delete_all_autorespon", async (i) => {
      if (!i.isButton()) return;
      const data = await autoresponModel.findOne({ guildId });
      if (!data || data.autorespon.length === 0) {
        await i.editOrReply({
          embeds: [
            new AsepEmbed({}, client)
              .setTitle("Tidak ada pesan otomatis!")
              .setDescription(
                "Kamu belum memiliki AutoResponder!\nSilakan cek lagi jika ingin dihapus semua!",
              )
              .setType("error"),
          ],
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
      await i.update({
        embeds: [
          embed
            .setDescription(
              "Apakah kamu yakin ingin menghapus semua AutoResponder?\nJika iya click tombol di bawah ini!",
            )
            .setType("error"),
        ],
        components: [
          new ActionRow<Button>().setComponents([
            new Button({
              custom_id: "delete_all-skip",
              style: ButtonStyle.Secondary,
              label: "No!",
            }),
            new Button({
              custom_id: "delete_all-confirm",
              style: ButtonStyle.Danger,
              label: "Yes!",
            }),
          ]),
        ],
      });
    });
    collector.run("delete_all-skip", async (i) => {
      if (!i.isButton()) return;
      await i.update({
        embeds: [
          embed
            .setDescription(
              "Setting autoresponder guild kamu !\nAgar guild lebih interaktif!",
            )
            .setType("info"),
        ],
        components: buttonRow,
      });
    });
    collector.run("delete_all-confirm", async (i) => {
      if (!i.isButton()) return;
      try {
        await autoresponModel.deleteMany({ guildId });
        await i.update({
          embeds: [
            embed
              .setDescription("Berhasil hapus semua pesan otomatis!")
              .setType("success"),
          ],
          components: buttonRow,
        });
      } catch (e) {
        client.logger.error(e);
        await i.editOrReply({
          embeds: [
            new AsepEmbed(
              {
                title: "Terjadi kesalahan tidak terduga!",
                description: "Silakan coba lagi beberapa saat!",
              },
              client,
            ),
          ],
          flags: MessageFlags.Ephemeral,
        });
      }
    });
  }
}
