import { Command, Declare, Options } from "seyfert";
import { SetupAdd } from "./setup-add.chatai.js";
import { SetupDelete } from "./setup-delete.chatai.js";

@Declare({
  name: "setup-chatai",
  description: "setup category untuk chat ai",
  defaultMemberPermissions: ["ManageGuild", "Administrator"],
})
@Options([SetupAdd, SetupDelete])
export default class SetupChatAI extends Command {}
