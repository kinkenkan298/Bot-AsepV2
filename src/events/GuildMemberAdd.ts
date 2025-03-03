import { createEvent } from "seyfert";

export default createEvent({
  data: { name: "guildMemberAdd" },
  async run(member, client) {
    console.log("ada yang keluar bang!");
  },
});
