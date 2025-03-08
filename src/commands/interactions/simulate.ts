import { AsepOptions } from "#asep/structures/utils/Decorators.js";
import {
  Command,
  type CommandContext,
  createStringOption,
  createUserOption,
  Declare,
  GuildMember,
  Options,
} from "seyfert";

const options = {
  user: createUserOption({
    description: "user yang mau di simulasi join! ",
    required: true,
  }),
  event: createStringOption({
    description: "Event apa yang mau ditrigger",
    required: true,
    choices: [
      {
        name: "join",
        value: "GUILD_MEMBER_ADD",
      },
      {
        name: "out",
        value: "GUILD_MEMBER_REMOVE",
      },
    ] as const,
  }),
};

@Declare({
  name: "simulate-join",
  description: "simulasi member ketika join guild!",
  defaultMemberPermissions: ["ManageGuild", "Administrator"],
  contexts: ["Guild"],
})
@AsepOptions({ onlyDeveloper: true })
@Options(options)
export default class SimulateJoinOut extends Command {
  override async run(ctx: CommandContext<typeof options>) {
    const { options, client } = ctx;
    const { user, event } = options;

    await ctx.deferReply(true);

    switch (event) {
      case "GUILD_MEMBER_ADD":
      case "GUILD_MEMBER_REMOVE": {
        await client.events!.values[event]?.run(
          user as unknown as GuildMember,
          client,
          ctx.shardId,
        );
        await ctx.editOrReply({
          content: "Berhasil trigger event guild!",
        });
        break;
      }
    }
  }
}
