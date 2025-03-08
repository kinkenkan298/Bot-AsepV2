import { AsepOptions } from "#asep/structures/utils/Decorators.js";
import { AsepCategory } from "#asep/structures/utils/types/index.js";
import { AutoLoad, Command, Declare } from "seyfert";

@Declare({
  name: "cek",
  description: "Cek Sesuatu disini",
})
@AutoLoad()
@AsepOptions({ cooldown: 10, category: AsepCategory.User })
export default class CekCommand extends Command {}
