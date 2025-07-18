import { Constants } from "#asep/structures/utils/data/Constants.js";
import { changePresence } from "#asep/structures/utils/functions/presence.js";
import mongoose from "mongoose";
import { createEvent } from "seyfert";

export default createEvent({
  data: { name: "ready", once: true },
  run: async (user, client, shardId) => {
    client.readyTimestamp = Date.now();
    client.logger.info(`API - Logged as : ${user.username}`);
    client.logger.info(
      `Client - ${user.username} v${Constants.Version} now ready!`,
    );

    changePresence(client);

    try {
      await mongoose.connect(process.env.MONGODB_URI!, {
        serverSelectionTimeoutMS: 0,
        socketTimeoutMS: 0,
        serverApi: {
          version: "1",
          strict: true,
          deprecationErrors: true,
        },
      });
      client.logger.info(`[AsepDatabase - Database] Koneksi berhasil !`);
    } catch (e) {
      client.logger.error(
        `[AsepDatabase - Database] Koneksi gagal tersambung!`,
      );
    }

    await client.uploadCommands({ cachePath: client.config.cache.filename });
  },
});
