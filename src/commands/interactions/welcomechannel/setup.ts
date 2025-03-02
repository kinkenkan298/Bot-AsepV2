import { AutoLoad, Command, Declare, IgnoreCommand } from "seyfert";

@Declare({
  name: "setup-channel",
  description: "setup welcome and leave channel!",
  defaultMemberPermissions: ["ManageGuild", "ManageChannels"],
  ignore: IgnoreCommand.Message,
})
@AutoLoad()
export default class SetupChanmel extends Command {}
