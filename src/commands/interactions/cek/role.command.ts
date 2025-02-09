import { Configuration } from "#asep/data/Configuration.js";
import { Cooldown, CooldownType } from "@slipher/cooldown";
import ms from "ms";
import {
  SubCommand,
  type CommandContext,
  Declare,
  createUserOption,
  Options,
  Formatter,
  Embed,
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
@Cooldown({
  interval: ms("5s"),
  type: CooldownType.User,
  uses: {
    default: 2,
  },
})
@Options(options)
export class RoleCommand extends SubCommand {
  public override async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();

    const user = ctx.options.user;
    const getRoles = await (await ctx.guild())?.members.fetch(user?.id);
    const roles = (await getRoles?.roles.list())
      ?.filter((role) => role.name !== "@everyone")
      .map((role) => Formatter.roleMention(role.id))
      .join(" - ");

    const embed = new Embed({
      author: {
        name: ctx.author.username,
        icon_url: ctx.author.avatarURL(),
      },
      title: `Role untuk : ${Formatter.bold(ctx.author.name)} `,
      description: roles,
      color: Configuration.colors.success,
      footer: {
        text: "Asep V2",
        icon_url: "https://i.ibb.co.com/n80TYD2w/xiao.jpg",
      },
      timestamp: new Date(Date.now()).toISOString(),
    });
    await ctx.editOrReply({
      embeds: [embed],
    });
  }
}
