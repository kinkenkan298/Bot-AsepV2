import { Command, Declare, Options } from "seyfert";
import { PerintahCommand } from "./perintah.command";
import { RoleCommand } from "./role.command";

@Declare({
  name: "cek",
  description: "Cek Sesuatu disini",
})
@Options([PerintahCommand, RoleCommand])
export default class CekCommand extends Command {}
