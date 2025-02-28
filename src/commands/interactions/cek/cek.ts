import { AutoLoad, Command, Declare } from "seyfert";

@Declare({
  name: "cek",
  description: "Cek Sesuatu disini",
})
@AutoLoad()
export default class CekCommand extends Command {}
