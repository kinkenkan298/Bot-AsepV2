import { Configuration } from "#asep/structures/utils/data/Configuration.js";
import { getCollectionKey } from "#asep/structures/utils/functions/utils.js";
import { createMiddleware, Embed } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";

export const checkCooldown = createMiddleware<void>(
  async ({ context, next, pass }) => {
    if (context.isComponent()) return next();
    const { client, command } = context;

    const { cooldowns } = client;
    if (!command) return pass();
    if (command.onlyDeveloper) return next();

    const cooldown = (command.cooldown ?? 3) * 1000;

    const now = Date.now();

    const data = cooldowns.get(getCollectionKey(context));
    if (data && now < data) {
      const time = Math.floor(data / 1000);
      context.editOrReply({
        flags: MessageFlags.Ephemeral,
        embeds: [
          new Embed({
            title: "Kamu sedang cooldown!",
            description: `Tunggu <t:${time}:R> (<t:${time}:t>) untuk menggunakan nya lagi!`,
            color: Configuration.colors.errors,
          }),
        ],
      });
      return pass();
    }
    cooldowns.set(getCollectionKey(context), now + cooldown, cooldown);
    return next();
  },
);
