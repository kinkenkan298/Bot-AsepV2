import { Command, Declare, Options } from "seyfert";
import { SetupAdd } from "./setup-add.chatai.js";
import { SetupDelete } from "./setup-delete.chatai.js";
import { AsepOptions } from "#asep/structures/utils/Decorators.js";
import { AsepCategory } from "#asep/structures/utils/types/index.js";

@Declare({
  name: "setup-chatai",
  description: "setup category untuk chat ai",
  defaultMemberPermissions: ["ManageGuild", "Administrator"],
})
@AsepOptions({ cooldown: 60, category: AsepCategory.Guild })
@Options([SetupAdd, SetupDelete])
export default class SetupChatAI extends Command {}
