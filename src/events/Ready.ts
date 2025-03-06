import mongoose from "mongoose";
import { createEvent } from "seyfert";

export default createEvent({
  data: { name: "ready", once: true },
  run: async (user, client) => {
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
      client.logger.info(`[${user.username} - Database] Koneksi berhasil !`);
    } catch (err) {
      client.logger.error(
        `[${user.username} - Database] Koneksi gagal tersambung!`,
      );
      client.logger.error(err);
    }
  },
});
