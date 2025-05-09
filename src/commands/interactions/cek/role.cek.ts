import { AsepEmbed } from "#asep/utils/classes/AsepEmbed.js";
import {
  SubCommand,
  type CommandContext,
  Declare,
  createUserOption,
  Options,
  Formatter,
} from "seyfert";

const options = {
  user: createUserOption({
    description: "Siapa yang mau dicek role nya bang?",
    required: true,
  }),
};

@Declare({
  name: "role",
  description: "cek role apa kamu!",
})
@Options(options)
export default class RoleCommand extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();

    const { user } = ctx.options;
    const getRoles = await (await ctx.guild())?.members.fetch(user?.id);
    const roles = (await getRoles?.roles.list())
      ?.filter((role) => role.name !== "@everyone")
      .map((role) => Formatter.roleMention(role.id))
      .join(" - ");

    const embed = new AsepEmbed(
      {
        title: `Role untuk : ${Formatter.bold(ctx.author.name)} `,
        description: roles,
      },
      ctx.client,
    );
    await ctx.editOrReply({
      embeds: [embed],
    });
  }
}
