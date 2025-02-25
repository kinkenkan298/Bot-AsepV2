import { Command, Declare, IgnoreCommand, Options } from "seyfert";
import { ReactRoleAdd } from "./react-add.js";
import { ReactRoleDelete } from "./react-delete.js";

@Declare({
  name: "reactrole",
  description: "Role seleksi menggunakan react emoji!",
  ignore: IgnoreCommand.Message,
  defaultMemberPermissions: ["ManageRoles"],
})
@Options([ReactRoleAdd, ReactRoleDelete])
export default class ReactRole extends Command {}
