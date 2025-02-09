import { Cooldown, CooldownType } from "@slipher/cooldown";
import ms from "ms";
import { CommandContext, Declare, SubCommand } from "seyfert";

@Declare({
  name: "delete",
  description: "hapus pesan otomatis",
  contexts: ["Guild"],
})
@Cooldown({
  interval: ms("10s"),
  type: CooldownType.User,
  uses: {
    default: 1,
  },
})
export default class DeleteSubcommand extends SubCommand {
  public override run(ctx: CommandContext) {
    ctx.write({
      content: "Delete",
    });
  }
}
