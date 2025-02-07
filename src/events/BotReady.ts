import { createEvent } from "seyfert";

export default createEvent({
  data: { once: true, name: "botReady" },
  async run(user, client) {
    try {
      client.logger.info(`${user.tag} Berhasil Login`);
    } catch (error) {
      client.logger.error(error, "Koneksi gagal ke database!");
    }
  },
});
