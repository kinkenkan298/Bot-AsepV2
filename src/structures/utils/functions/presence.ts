import { Constants } from "#asep/data/Constants.js";
import { Guild, UsingClient } from "seyfert";
import {
  GatewayActivityUpdateData,
  PresenceUpdateStatus,
} from "seyfert/lib/types/index.js";
import { ms } from "./time.js";

export function changePresence(client: UsingClient) {
  let index: number = 0;

  const array: GatewayActivityUpdateData[] = Constants.Activities();
  setInterval((): void => {
    if (index >= array.length) index = 0;

    const guilds: Guild<"cached">[] = client.cache.guilds?.values() ?? [];
    const users: number = guilds.reduce((a, b) => a + (b.memberCount ?? 0), 0);
    const players: number = 1;

    const activities: GatewayActivityUpdateData[] = Constants.Activities({
      guilds: guilds.length,
      users,
      players,
    });
    const activity: GatewayActivityUpdateData =
      activities[index++ % array.length];

    client.gateway.setPresence({
      afk: false,
      since: Date.now(),
      activities: [activity],
      status: PresenceUpdateStatus.Online,
    });
  }, ms("25s"));
  client.gateway.setPresence({
    afk: false,
    since: Date.now(),
    activities: [array[index]],
    status: PresenceUpdateStatus.Online,
  });
}
