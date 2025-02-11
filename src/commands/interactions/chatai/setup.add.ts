import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import {
  CommandContext,
  createChannelOption,
  Declare,
  Options,
  SubCommand,
} from "seyfert";
import { ChannelType } from "seyfert/lib/types/index.js";
import ChatAIModel from "#asep/structures/schemas/user/ChatAIModel.js";

const options = {
  category: createChannelOption({
    description: "category channel yang ingin dijadiin chatai!",
    required: true,
    channel_types: [ChannelType.GuildCategory],
  }),
};
@Declare({
  name: "add",
  description: "tambah category untuk chatai asep!",
})
@Options(options)
export class SetupAdd extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { client, guildId, options } = ctx;
    const { category } = options;
    const embed = new AsepEmbed({}, client);
    try {
      let fetchData = await ChatAIModel.findOne({ guildId, category });
      if (!fetchData) {
        const newData = new ChatAIModel({
          guildId,
          category,
        });
        try {
          await newData.save();
          await ctx.editOrReply({
            embeds: [
              embed
                .setTitle("Berhasil menambahkan category untuk chatai!")
                .setType("success"),
            ],
          });
        } catch (e) {
          client.logger.error(
            e,
            "Terjadi kesalahan dalam menyimpan nya database!",
          );
          await ctx.editOrReply({
            embeds: [
              embed
                .setTitle("Terjadi kesalahan dalam menyimpan ke database!")
                .setType("error"),
            ],
          });
        }
      } else {
        await ctx.editOrReply({
          embeds: [
            embed
              .setTitle("Category channel sudah ada dalam database!")
              .setDescription("Hapus jika ingin mengganti dengan yang lain!!")
              .setType("error"),
          ],
        });
      }
    } catch (e) {
      client.logger.error(e);
    }
  }
}
