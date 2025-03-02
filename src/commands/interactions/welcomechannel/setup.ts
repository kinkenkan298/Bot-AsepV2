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
    defaultDescription: "set up channel for welcome and out member",
  },
})
export default class SetupChanmel extends Command {}
