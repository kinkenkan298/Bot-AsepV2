import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import {
  CommandContext,
  createChannelOption,
  Declare,
  Formatter,
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
      let fetchData = await ChatAIModel.findOne({ guildId });
      if (fetchData) {
        const oldCategory = fetchData.category;
        if (oldCategory === category.id) {
          await ctx.editOrReply({
            embeds: [
              embed.setTitle('Category channel sudah ada di database!').setType('error')
            ]
          })
        } else {
          fetchData.category = category.id;
          fetchData.save()
          await ctx.editOrReply({
            embeds: [
              embed
                .setTitle(`Category channel berhasil diupdate ke ${Formatter.channelMention(category.id)}`)
                .setType('success')
            ]
          })
        }
      } else {
        const newData = new ChatAIModel({
          guildId,
          category: category.id
        })
        try {
          await newData.save();
          await ctx.editOrReply({
            embeds: [
              embed
                .setTitle('Berhasil menambahkan category channel untuk chatai!')
                .setType('success')
            ]
          })
        } catch (e) {
          client.logger.error(e)
          await ctx.editOrReply({
            embeds: [
              embed.setTitle('Terjadi kesalahan dalame menyimpan ke database!').setType('error')
            ]
          });
        }
      }
    } catch (e) {
      client.logger.error(e);
    }
  }
}
