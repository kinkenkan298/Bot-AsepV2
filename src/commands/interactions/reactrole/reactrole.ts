import { AutoLoad, Command, Declare, IgnoreCommand } from "seyfert";

@Declare({
  name: "reactrole",
  description: "Role seleksi menggunakan react emoji!",
  ignore: IgnoreCommand.Message,
  defaultMemberPermissions: ["ManageRoles"],
})
@AutoLoad()
export default class ReactRole extends Command {}
