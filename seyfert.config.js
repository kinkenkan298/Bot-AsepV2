// @ts-check
import { config } from "seyfert";
import "dotenv/config";

export default config.bot({
  token: process.env.TOKEN_DISCORD ?? "",
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessages",
    "GuildMessageReactions",
    "MessageContent",
  ],
  locations: {
    base: "src",
    commands: "commands",
    events: "events",
    components: "components",
  },
});
