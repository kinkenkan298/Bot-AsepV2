import { AsepOptions } from "#asep/structures/utils/Decorators.js";
import { AsepCategory } from "#asep/structures/utils/types/index.js";
import { AutoLoad, Command, Declare } from "seyfert";

@Declare({
  name: "autorespon",
  description: "bikin pesan otomatis pada guild",
  contexts: ["Guild"],
  defaultMemberPermissions: ["ManageGuild", "Administrator"],
})
@AutoLoad()
@AsepOptions({ cooldown: 10, category: AsepCategory.Guild })
export default class AutoresponCommand extends Command {}
