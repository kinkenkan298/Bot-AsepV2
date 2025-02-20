import {
  ATiktokListener,
  AutoresponListener,
  ChatAIListerner,
} from "#asep/listeners";
import { createEvent } from "seyfert";

export default createEvent({
  data: { name: "messageCreate" },
  async run(message, client) {
    if (message.author.bot) return;

    await AutoresponListener(client, message);
    await ChatAIListerner(client, message);
    await ATiktokListener(message, client);
  },
});
