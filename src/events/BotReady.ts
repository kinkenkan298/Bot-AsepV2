import { BOT_VERSION } from "#asep/data/Constants.js";
import { changePresence } from "#asep/utils/functions/presence.js";
import { createEvent } from "seyfert";

export default createEvent({
  data: { once: true, name: "botReady" },
  run: async (user, client) => {
    client.readyTimestamp = Date.now();
    client.logger.info(`API - Logged as : ${user.username}`);
    client.logger.info(`Client - ${user.username} v${BOT_VERSION} now ready!`);
    await client.database.connect();
    await client.uploadCommands({ cachePath: client.config.cache.filename });
    changePresence(client);
  },
});
