import { BOT_ACTIVITIES } from "#asep/data/Constants.js";
import { UsingClient } from "seyfert";
import { PresenceUpdateStatus } from "seyfert/lib/types/index.js";

export function changePresence(client: UsingClient) {
  let activities = 0;

  setInterval(() => {
    if (activities === BOT_ACTIVITIES.length) activities = 0;

    const guilds = client.cache.guilds?.count();
    const users = client.cache.users?.count();
    const randomActivities =
      BOT_ACTIVITIES[activities++ % BOT_ACTIVITIES.length];
    client.gateway.setPresence({
      afk: false,
      since: Date.now(),
      status: PresenceUpdateStatus.Online,
      activities: [
        {
          ...randomActivities,
          name: randomActivities.name
            .replaceAll("{users}", `${users}`)
            .replaceAll("{guilds}", `${guilds}`),
        },
      ],
    });
  }, 30 * 1000);
  client.gateway.setPresence({
    activities: [BOT_ACTIVITIES[0]],
    afk: false,
    since: Date.now(),
    status: PresenceUpdateStatus.Online,
  });
}
