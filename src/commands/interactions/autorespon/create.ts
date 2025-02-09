import { Cooldown, CooldownType } from "@slipher/cooldown";
import ms from "ms";
import {
  CommandContext,
  Declare,
  SubCommand,
} from "seyfert/lib/commands/index.js";

@Declare({
  name: "create",
  description: "buat pesan otomatis",
})
@Cooldown({
  interval: ms("10s"),
  type: CooldownType.User,
  uses: {
    default: 1,
  },
})
export default class CreateSubcommand extends SubCommand {
  public override run(ctx: CommandContext) {
    ctx.write({
      content: "Create",
    });
  }
}
