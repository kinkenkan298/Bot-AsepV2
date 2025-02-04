import { Client } from "seyfert";
import { ActivityType, PresenceUpdateStatus } from "seyfert/lib/types";

const client = new Client({
  gateway: {
    properties: {
      os: "Android",
      browser: "Discord Android",
      device: "android",
    },
  },
  presence: () => ({
    status: PresenceUpdateStatus.Online,
    activities: [
      {
        name: "Akatsuki",
        type: ActivityType.Watching,
      },
    ],
    since: Date.now(),
    afk: false,
  }),
});

const InitMain = async () => {
  try {
    client.start().then(() => {
      client.uploadCommands({ cachePath: "./commands.json" });
    });
  } catch (error) {
    client.logger.fatal(error, "Isi Token nya bang!");
    process.exit(1);
  }
};

InitMain();
