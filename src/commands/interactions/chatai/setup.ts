import { Command, CommandContext, Declare, Options } from "seyfert";
import { SetupAdd } from "./setup.add.js";
import { SetupDelete } from "./setup-delete.js";

@Declare({
  name: "setup-chatai",
  description: "setup category untuk chat ai",
  defaultMemberPermissions: ["ManageGuild", "Administrator"],
})
@Options([SetupAdd, SetupDelete])
export default class SetupChatAI extends Command {
  public override async run(ctx: CommandContext) {}
}
