// @ts-check
import { config } from "seyfert";
import "dotenv/config";
import { Constants } from "#asep/data/Constants.js";

export default config.bot({
  token: process.env.TOKEN_DISCORD ?? "",
  debug: Constants.Debug,
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessages",
    "GuildMessageReactions",
    "MessageContent",
  ],
  locations: {
    base: Constants.WorkingDirectory(),
    commands: "commands",
    events: "events",
    components: "components",
    langs: "languages",
  },
});
