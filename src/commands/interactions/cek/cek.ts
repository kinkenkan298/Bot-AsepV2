import { Command, Declare, Options } from "seyfert";
import { RoleCommand } from "./role.cek.js";
import { PerintahCommand } from "./perintah.cek.js";

@Declare({
  name: "cek",
  description: "Cek Sesuatu disini",
})
@Options([RoleCommand, PerintahCommand])
export default class CekCommand extends Command {}
