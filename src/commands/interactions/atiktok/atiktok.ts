import { AsepEmbed } from "#asep/structures/utils/classes/AsepEmbed.js";
import { TiktokURLregex } from "#asep/structures/utils/data/Constants.js";
import { existsSync, unlinkSync } from "fs";
import ms from "ms";
import {
  Command,
  CommandContext,
  createStringOption,
  Declare,
  OKFunction,
  Options,
  AttachmentBuilder,
} from "seyfert";

const options = {
  url: createStringOption({
    description: "url tiktok!",
    required: true,
    value(data, ok: OKFunction<URL>, fail) {
      if (TiktokURLregex.test(data.value)) return ok(new URL(data.value));
      fail("yang kamu masukan bukan url tiktok!");
    },
  }),
};

@Declare({
  name: "atiktok",
  description: "Kirim video tiktokmu",
})
@Options(options)
export default class ATiktokCommand extends Command {
  public override async run(ctx: CommandContext<typeof options>) {
    const { client, options, interaction } = ctx;
    const { url } = options;
    await ctx.deferReply();
  }
  public override async onRunError(context: CommandContext, error: unknown) {
    context.client.logger.error(error);
    context.editOrReply({
      embeds: [
        new AsepEmbed(
          {
            title: "Terjadi kesalahan tidak terduga!",
            description: "Silakan coba lagi nanti!",
          },
          context.client,
        ).setType("error"),
      ],
    });
  }
}
