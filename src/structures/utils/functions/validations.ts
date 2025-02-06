import { InvalidEnvironment } from "#asep/errors";
import { Logger } from "seyfert";

const logger = new Logger({
  name: "[Logs]",
});

export function validasiEnv() {
  logger.info("Mengecek Env File ....");
  if (!process.env.TOKEN_DISCORD)
    throw new InvalidEnvironment("Tidak ada token discord bang !!");
  if (!process.env.MONGODB_URI)
    throw new InvalidEnvironment("Tolong isi URI MongoDB nya !!");

  return logger.info("Env aman tidak ada kesalahan ....");
}
