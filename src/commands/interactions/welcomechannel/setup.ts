import { AsepOptions } from "#asep/structures/utils/Decorators.js";
import { AsepCategory } from "#asep/structures/utils/types/index.js";
import { AutoLoad, Command, Declare, Groups, IgnoreCommand } from "seyfert";

@Declare({
  name: "setup-channel",
  description: "setup welcome and leave channel!",
  defaultMemberPermissions: ["ManageGuild", "ManageChannels"],
  ignore: IgnoreCommand.Message,
})
@AutoLoad()
@Groups({
  welcome: {
    defaultDescription: "set up channel for welcome member!",
  },
  leave: {
    defaultDescription: "set up channel for leave member!",
  },
})
@AsepOptions({ cooldown: 20, category: AsepCategory.Guild })
export default class SetupChanmel extends Command {}
