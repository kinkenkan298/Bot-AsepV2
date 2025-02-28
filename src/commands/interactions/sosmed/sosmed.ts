import { AutoLoad, Command, Declare, IgnoreCommand } from "seyfert";

@Declare({
  name: "sosmed",
  description: "Bagikan media sosial mu ke discord!",
  ignore: IgnoreCommand.Message,
})
@AutoLoad()
export default class ASosmed extends Command {}
