import { AsepOptions } from "#asep/structures/utils/Decorators.js";
import { AsepCategory } from "#asep/structures/utils/types/index.js";
import { AutoLoad, Command, Declare, IgnoreCommand } from "seyfert";

@Declare({
  name: "reactrole",
  description: "Role seleksi menggunakan react emoji!",
  ignore: IgnoreCommand.Message,
  defaultMemberPermissions: ["ManageRoles"],
})
@AutoLoad()
@AsepOptions({ cooldown: 10, category: AsepCategory.Guild })
export default class ReactRole extends Command {}
