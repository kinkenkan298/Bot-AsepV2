import { AsepOptions } from "#asep/structures/utils/Decorators.js";
import { AsepCategory } from "#asep/structures/utils/types/index.js";
import { AutoLoad, Command, Declare, IgnoreCommand } from "seyfert";

@Declare({
  name: "sosmed",
  description: "Bagikan media sosial mu ke discord!",
  ignore: IgnoreCommand.Message,
})
@AutoLoad()
@AsepOptions({ cooldown: 10, category: AsepCategory.User })
export default class ASosmed extends Command {}
