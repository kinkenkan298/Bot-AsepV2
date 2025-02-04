import mongoose from "mongoose";
import { createEvent } from "seyfert";
import config from "../constant/config";

export default createEvent({
  data: { once: true, name: "botReady" },
  async run(user, client) {
    try {
      mongoose.set("strictQuery", false);
      await mongoose.connect(config.mongodbURI);
      client.logger.info(`Koneksi berhasil ke database!`);
      client.logger.info(`${user.tag} Berhasil Login`);
    } catch (error) {
      client.logger.error(error, "Koneksi gagal ke database!");
    }
  },
});
