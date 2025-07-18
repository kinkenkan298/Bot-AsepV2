process.loadEnvFile();
import { AsepClient } from "#asep/client";
import { validasiEnv } from "#asep/utils/functions/validations.js";
import { AsepLogger } from "#asep/utils/Logger.js";
import { Logger } from "seyfert";

Logger.customize(AsepLogger);
Logger.saveOnFile = "all";
Logger.dirname = "logs";

validasiEnv();

const client = new AsepClient();
export { client };

(async (): Promise<void> => {
  await client.run();
})();
