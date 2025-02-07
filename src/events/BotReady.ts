import { createEvent } from "seyfert";

export default createEvent({
  data: { once: true, name: "botReady" },
  run: async (user, client) => {
    client.readyTimestamp = Date.now();
    client.logger.info(`API - Logged as : ${user.username}`);
    client.logger.info(`Client - ${user.username} v2 now ready!`);
    await client.database.connect();
    await client.uploadCommands({ cachePath: client.config.cache.filename });
  },
});
