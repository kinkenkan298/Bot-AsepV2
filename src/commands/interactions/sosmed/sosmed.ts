import { Command, Declare, IgnoreCommand, Options } from "seyfert";
import { ATiktokCommand } from "./sosmed.atiktok.js";
import { AInstaCommand } from "./sosmed.ainsta.js";

@Declare({
  name: "sosmed",
  description: "Bagikan media sosial mu ke discord!",
  ignore: IgnoreCommand.Message,
})
@Options([ATiktokCommand, AInstaCommand])
export default class ASosmed extends Command {}
