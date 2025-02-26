import ReactRoleModel from "#asep/structures/schemas/guilds/ReactRoleModel.js";
import { createEvent, Embed } from "seyfert";

export default createEvent({
  data: { name: "messageReactionAdd" },
  run: async (reactions, client) => {
    if (!reactions.guildId) return;

    const { guildId, messageId, userId, channelId } = reactions;

    let reactModel;
    try {
      reactModel = await ReactRoleModel.findOne({
        guildId,
        messageId,
        emoji: reactions.emoji.id || reactions.emoji.name,
      });
    } catch (e) {
      client.logger.error(e);
    }
    if (!reactModel) return;

    const roles = await client.roles.list(guildId);
    if (!roles) return;

    const user = await client.members.fetch(guildId, userId);
    const member = client.cache.guilds?.get(guildId);
    for (const role of roles) {
      if (reactModel.roleId === role.id) {
        await member?.members.addRole(userId, role.id);
      }
    }
  },
});
