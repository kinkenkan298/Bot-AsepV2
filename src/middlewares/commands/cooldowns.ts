import { Configuration } from "#asep/data/Configuration.js";
import { getCollectionKey } from "#asep/utils/functions/utils.js";
import { createMiddleware, Embed } from "seyfert";

export const checkCooldown = createMiddleware<void>(
  async ({ context, next, pass }) => {
    if (context.isComponent()) return next();

    const { client, command } = context;
    const { cooldowns } = client;
    if (!command) return pass();
    if (command.onlyDeveloper) return next();

    const cooldown = (command.cooldown ?? 3) * 1000;
    const time = Date.now();
    const data = cooldowns.get(getCollectionKey(context));
    if (data && time < data) {
      context.editOrReply({
        embeds: [
          new Embed({
            description: `Tolong tunggu ${data} detik lagi!!`,
            color: Configuration.colors.errors,
          }),
        ],
      });
      return pass();
    }
    cooldowns.set(getCollectionKey(context), time + cooldown, cooldown);

    return next();
  },
);
