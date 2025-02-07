import { Configuration } from "#asep/data/Configuration.js";
import { createMiddleware, Formatter } from "seyfert";
import { TimestampStyle } from "seyfert/lib/common/index.js";
import { MessageFlags } from "seyfert/lib/types/index.js";

export const checkCooldown = createMiddleware<void>(
  async ({ context, next, pass }) => {
    if (context.isComponent()) return next();
    const inCooldown = context.client.cooldown.context(context);
    if (typeof inCooldown == "number") {
      const msg = `Kamu sedang cooldown, tolong tunggu ${Formatter.timestamp(new Date(Date.now() + inCooldown), TimestampStyle.RelativeTime)}`;
      await context.editOrReply({
        flags: MessageFlags.Ephemeral,
        embeds: [
          {
            description: msg,
            color: Configuration.colors.errors,
          },
        ],
      });
      return pass();
    }
    return next();
  },
);
