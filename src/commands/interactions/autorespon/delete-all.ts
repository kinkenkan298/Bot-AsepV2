import AutoresponModel from "#asep/schemas/guilds/AutoresponModel.js";
import { AsepEmbed } from "#asep/utils/classes/AsepEmbed.js";
import { Cooldown, CooldownType } from "@slipher/cooldown";
import ms from "ms";
import {
  CommandContext,
  Declare,
  SubCommand,
} from "seyfert/lib/commands/index.js";

@Declare({
  name: "delete-all",
  description: "hapus semua pesan otomatis",
})
@Cooldown({
  interval: ms("10s"),
  type: CooldownType.User,
  uses: {
    default: 1,
  },
})
export default class DeleteAllSubcommand extends SubCommand {
  public override async run(ctx: CommandContext) {
    const { interaction, guildId, client } = ctx;
    if (!interaction?.replied) await ctx.deferReply();
    try {
      const data = await AutoresponModel.findOneAndDelete({ guildId });
      const embed = new AsepEmbed({}, client);
      if (!data) {
        await ctx.editOrReply({
          embeds: [
            embed
              .setType("error")
              .setTitle("Tidak ada pesan otomatis yang tersedia!"),
          ],
        });
        return;
      }
      await ctx.editOrReply({
        embeds: [
          embed
            .setDescription(
              "Berhasil hapus semua pesan otomatis yang tersedia!!",
            )
            .setTitle("Berhasil")
            .setType("success"),
        ],
      });
    } catch (e) {
      client.logger.error(e);
    }
  }
}
