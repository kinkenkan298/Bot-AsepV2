import { AutoresponListener } from "#asep/listeners";
import { createEvent } from "seyfert";

export default createEvent({
  data: { name: "messageCreate" },
  async run(message, client) {
    if (message.author.bot) return;

    await AutoresponListener(client, message);
  },
});
