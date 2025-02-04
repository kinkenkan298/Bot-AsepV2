import { createEvent } from "seyfert";

export default createEvent({
  data: { name: "messageCreate" },
  async run(message, client) {
    if (message.author.bot) return;

    const msg = message.content.toLowerCase();
    if (msg === "p")
      message.reply({
        content: "Jangan P gitu bang",
      });
  },
});
