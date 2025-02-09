import { BOT_VERSION } from "#asep/data/Constants.js";
import { changePresence } from "#asep/utils/functions/presence.js";
import mongoose from "mongoose";
import { createEvent } from "seyfert";

export default createEvent({
  data: { once: true, name: "botReady" },
  run: async (user, client) => {
    client.readyTimestamp = Date.now();
    try {
      await mongoose.connect(process.env.MONGODB_URI!);
      client.logger.info("[Asep - Database]: Koneksi Berhasil");
    } catch (err) {
      client.logger.error(err);
    }
    client.logger.info(`API - Logged as : ${user.username}`);
    client.logger.info(`Client - ${user.username} v${BOT_VERSION} now ready!`);
    await client.uploadCommands({ cachePath: client.config.cache.filename });
    changePresence(client);
  },
});
