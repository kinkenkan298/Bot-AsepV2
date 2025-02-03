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
  presence: (shardId) => ({
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
    await client.start();
    await client.uploadCommands({ cachePath: "./commands.json" });
  } catch (error) {
    client.logger.fatal(error);
    process.exit(1);
  }
};

InitMain();
