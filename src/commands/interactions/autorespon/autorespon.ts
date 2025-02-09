import { Cooldown, CooldownType } from "@slipher/cooldown";
import ms from "ms";
import { AutoLoad, Command, Declare } from "seyfert";

@Declare({
  name: "autorespon",
  description: "bikin pesan otomatis pada guild",
  contexts: ["Guild"],
  defaultMemberPermissions: ["ManageGuild", "Administrator"],
})
@AutoLoad()
@Cooldown({
  interval: ms("15s"),
  type: CooldownType.Guild,
  uses: {
    default: 3,
  },
})
export default class AutoresponCommand extends Command {}
