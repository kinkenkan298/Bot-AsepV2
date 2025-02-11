// @ts-check
import { config } from "seyfert";
import "dotenv/config";
import { GatewayIntentBits } from "seyfert/lib/types";

export default config.bot({
  token: process.env.TOKEN_DISCORD ?? "",
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  locations: {
    base: "src",
    commands: "commands",
    events: "events",
    components: "components",
  },
});
