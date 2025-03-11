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
  Modal,
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
export default class AutoresponCommand extends Command {
  public override async run(ctx: CommandContext) {
    const { client, guildId } = ctx;

    await ctx.deferReply();

    const embed = new AsepEmbed(
      {
        title: "Konfigurasi Autoresponder!",
        description:
          "Setting autoresponder guild kamu !\nAgar guild lebih interaktif!",
      },
      client,
    ).setType("info");

    const message = await ctx.editOrReply(
      {
        embeds: [embed],
        components: [
          new ActionRow<Button>().setComponents([
            new Button({
              custom_id: "create_autorespon",
              label: "Add Autorespon",
              style: ButtonStyle.Success,
            }),
            new Button({
              custom_id: "list_autorespon",
              label: "List Autorespon",
              style: ButtonStyle.Primary,
            }),
            new Button({
              custom_id: "delete_autorespon",
              label: "Remove response",
              style: ButtonStyle.Danger,
            }),
          ]),
          new ActionRow<Button>().setComponents([
            new Button({
              custom_id: "delete_all_autorespon",
              label: "Delete All Autorespon",
              style: ButtonStyle.Secondary,
            }),
            new Button({
              custom_id: "stopevent_autorespon",
              label: "Stop Event!",
              style: ButtonStyle.Danger,
            }),
          ]),
        ],
      },
      true,
    );

    const collector = message.createComponentCollector({
      filter: (i) => i.user.id === ctx.author.id,
      onStop(reason, refresh) {
        if (reason === "idle") return refresh();
      },
      idle: 60000,
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
          await ctx.editOrReply({
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
        await ctx.editOrReply({
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
  }
}
