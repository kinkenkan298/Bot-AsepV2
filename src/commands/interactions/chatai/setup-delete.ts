import ChatAIModel from "#asep/structures/schemas/user/ChatAIModel.js";
import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import {
  CommandContext,
  createChannelOption,
  Declare,
  Options,
  SubCommand,
} from "seyfert";
import { ChannelType } from "seyfert/lib/types/index.js";

const options = {
  category: createChannelOption({
    description: "category channel yang ingin dijadiin chatai!",
    required: true,
    channel_types: [ChannelType.GuildCategory],
  }),
};
@Declare({
  name: "remove",
  description: "Delete category untuk chatai asep!",
})
@Options(options)
export class SetupDelete extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { client, guildId, options } = ctx;
    const { category } = options;
    const embed = new AsepEmbed({}, client);
    try {
      let fetchData = await ChatAIModel.findOneAndDelete({ guildId, category });
      if (fetchData) {
        await ctx.editOrReply({
          embeds: [
            embed
              .setTitle("Berhasil menghapus category untuk chatai!")
              .setType("success"),
          ],
        });
      } else {
        await ctx.editOrReply({
          embeds: [
            embed
              .setTitle("Category channel tidak ada dalam database!")
              .setDescription("Tolong tambahkan category channel!")
              .setType("error"),
          ],
        });
      }
    } catch (e) {
      client.logger.error(e);
    }
  }
}
