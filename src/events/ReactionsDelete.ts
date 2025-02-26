import { createEvent } from "seyfert";

export default createEvent({
  data: { name: "messageReactionRemove" },
  run: async (reactions, client) => {
    console.log(reactions);
  },
});
