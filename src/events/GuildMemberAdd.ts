import { createEvent } from "seyfert";

export default createEvent({
  data: { name: "guildMemberAdd" },
  async run() {
    console.log("ada yang keluar bang!");
  },
});
