import { ReactRoleListener } from "#asep/structures/listeners/guild/ReactRole.js";
import { createEvent } from "seyfert";

export default createEvent({
  data: { name: "messageReactionAdd" },
  run: async (reactions) => {
    console.log(reactions);
  },
});
