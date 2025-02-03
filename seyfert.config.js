import { config } from "seyfert";
import "dotenv/config";

export default config.bot({
  token: process.env.TOKEN_DISCORD ?? "",
  locations: {
    base: "src",
    commands: "commands",
    events: "events",
  },
  intents: ["Guilds", "GuildMessages", "GuildMembers", "MessageContent"],
});
