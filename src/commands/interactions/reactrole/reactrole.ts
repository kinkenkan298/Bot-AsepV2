import {
  Command,
  CommandContext,
  Declare,
  IgnoreCommand,
  Options,
} from "seyfert";
import { ReactRoleAdd } from "./react-add.js";

@Declare({
  name: "reactrole",
  description: "Role seleksi menggunakan react emoji!",
  ignore: IgnoreCommand.Message,
  defaultMemberPermissions: ["ManageRoles"],
})
@Options([ReactRoleAdd])
export default class ReactRole extends Command {}
