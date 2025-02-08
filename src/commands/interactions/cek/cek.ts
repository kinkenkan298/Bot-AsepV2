import { Command, Declare, Options } from "seyfert";
import { PerintahCommand } from "./perintah.command.js";
import { RoleCommand } from "./role.command.js";

@Declare({
  name: "cek",
  description: "Cek Sesuatu disini",
})
@Options([PerintahCommand, RoleCommand])
export default class CekCommand extends Command {}
