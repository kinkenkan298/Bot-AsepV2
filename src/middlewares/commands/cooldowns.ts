import { createMiddleware } from "seyfert";

export const checkCooldown = createMiddleware<void>(
  async ({ context, next, pass }) => {
    if (context.isComponent()) return next();

    const { client, command } = context;
    //const { cooldowns } = client;

    if (!command) return pass();
  },
);
