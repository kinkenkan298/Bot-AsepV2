import setupChannelModel from "#asep/structures/schemas/guilds/SetupChannel.js";
import { Configuration } from "#asep/structures/utils/data/Configuration.js";
import { AsepOptions } from "#asep/structures/utils/Decorators.js";
import { AsepCategory } from "#asep/structures/utils/types/index.js";
import {
  ActionRow,
  Button,
  ChannelSelectMenu,
  Command,
  type CommandContext,
  Declare,
  Embed,
  Formatter,
  Modal,
  WebhookMessage,
} from "seyfert";
import { Message } from "seyfert/lib/structures/Message.js";
import {
  ButtonStyle,
  ChannelType,
  ComponentType,
  TextInputStyle,
} from "seyfert/lib/types/index.js";

@Declare({
  name: "setup-welcome",
  description: "Set up welcome channel system !",
  defaultMemberPermissions: ["ManageGuild", "Administrator"],
  contexts: ["Guild"],
})
@AsepOptions({ cooldown: 15, category: AsepCategory.Guild })
export default class WelcomeSystem extends Command {
  public override async run(ctx: CommandContext) {
    const { client, guildId } = ctx;
    await ctx.deferReply();
    const embed = new Embed({
      title: "Setting welcome channel system!",
      color: Configuration.colors.info,
      timestamp: new Date(Date.now()).toISOString(),
      footer: {
        text: `Asep - Welcome System`,
        icon_url: client.me.avatarURL({ extension: "png" }),
      },
    });
    const channelRow = new ActionRow<ChannelSelectMenu>().setComponents([
      new ChannelSelectMenu({
        placeholder: "Silakan pilih channel nya!",
        custom_id: `select-welcome-channel`,
        channel_types: [ChannelType.GuildText],
      }),
    ]);
    const buttonRow = new ActionRow<Button>().setComponents([
      new Button({
        custom_id: `edit-welcome-channel`,
        style: ButtonStyle.Primary,
        label: "Edit Welcome channel!!",
      }),
      new Button({
        custom_id: `edit-welcome-message`,
        style: ButtonStyle.Primary,
        label: "Edit Welcome Message!",
      }),
      new Button({
        custom_id: `setopsetup`,
        style: ButtonStyle.Danger,
        label: "Stop set up channel!",
      }),
    ]);
    let message: Message | WebhookMessage;
    const data = await setupChannelModel.findOne({ guildId });
    if (data) {
      message = await ctx.editOrReply(
        {
          embeds: [
            embed.setDescription(
              `Welcome channel telah di set ${Formatter.channelMention(data.channelId)}!\nApakah kamu ingin mengubah nya?\nPencet dibawah jika ada yang ingin diubah!`,
            ),
          ],
          components: [buttonRow],
        },
        true,
      );
    } else {
      message = await ctx.editOrReply(
        {
          embeds: [
            embed.setDescription(
              `Welcome channel belom di set!!\nSilakan pilih channel yang ingin dijadikan welcome channel!`,
            ),
          ],
          components: [channelRow],
        },
        true,
      );
    }
    const modalMessage = new Modal({
      custom_id: "edit_message",
      title: "Setting welcome message!",
      components: [
        {
          components: [
            {
              custom_id: "customWelcomeMessage",
              label: "Ubah pesan welcome channel",
              placeholder: "Isi teks nya disini ...",
              style: TextInputStyle.Paragraph,
              required: false,
              value:
                data?.customMessage ||
                `Hello {username}, Semoga betah di {server-name}`,
              max_length: 200,
              type: ComponentType.TextInput,
            },
          ],
          type: ComponentType.ActionRow,
        },
      ],
    });
    const collect = message.createComponentCollector({
      filter: (i) => i.user.id === ctx.author.id,
      onStop(reason, refresh) {
        if (reason === "idle") return refresh();
      },
      idle: 3000,
    });

    collect.run(`select-welcome-channel`, async (i) => {
      if (i.isChannelSelectMenu()) {
        const value = i.values[0];
        await setupChannelModel.findOneAndUpdate(
          { guildId },
          { channelId: value },
          { upsert: true },
        );
        await i.update({
          embeds: [
            embed.setDescription(
              `Apakah kamu yakin ingin jadikan ${Formatter.channelMention(value)} sebagai welcome channel?\nApakah ada yang ingin di edit lagi?\nPencet dibawah ini jika ada yang ingin diubah!`,
            ),
          ],
          components: [
            new ActionRow<Button>().setComponents([
              new Button({
                custom_id: "welcome_message",
                style: ButtonStyle.Primary,
                label: "Set welcome message",
              }),
              new Button({
                custom_id: "skip_welcome_message",
                style: ButtonStyle.Secondary,
                label: "Skip welcome message",
              }),
            ]),
          ],
        });
      }
    });
    collect.run("edit-welcome-channel", async (i) => {
      if (i.isButton()) {
        await i.update({
          embeds: [
            embed.setDescription(
              "Silakan pilih channel yang ini di jadikan welcome channel!",
            ),
          ],
          components: [channelRow],
        });
      }
    });
    collect.run("edit-welcome-message", async (i) => {
      if (i.isButton()) await i.modal(modalMessage);
    });
    collect.run("welcome_message", async (i) => {
      if (i.isButton()) await i.modal(modalMessage);
    });
    collect.run("setopsetup", async (i) => {
      if (!i.isButton()) return;
      await i.update({
        embeds: [
          embed
            .setDescription("Konfigurasi telah di stop!")
            .setColor(Configuration.colors.errors),
        ],
        components: [],
      });
      collect.stop("stop operation");
    });
  }
}
