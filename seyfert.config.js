// @ts-check
import { config } from "seyfert";
import 'dotenv/config'
import { DEV_MODE, DEBUG_MODE } from "#asep/data/Constants.js";

const base = DEV_MODE ? "src" : "dist";

export default config.bot({
  token: process.env.TOKEN_DISCORD ?? "",
  debug: DEBUG_MODE,
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessages",
    "GuildMessageReactions",
    "MessageContent",
  ],
  locations: {
    base,
    commands: "commands",
    events: "events",
    components: "components",
  },
});
