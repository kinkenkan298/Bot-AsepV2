import { WorkerManager } from "seyfert";
import { Constants } from "#asep/data/Constants.js";
import { ActivityType, PresenceUpdateStatus } from "seyfert/lib/types/index.js";
import { join } from "path";

const manager = new WorkerManager({
  mode: "clusters",
  path: join(process.cwd(), Constants.WorkingDirectory(), "index.ts"),
  shardsPerWorker: 8,
  totalShards: 304,
  debug: false,
  presence(shardId, workerId) {
    return {
      status: PresenceUpdateStatus.Online,
      since: Date.now(),
      afk: false,
      activities: [
        {
          name: "smoothbot.live/premium",
          state: `Cluster ${workerId} | Shard ${shardId}`,
          type: ActivityType.Custom,
        },
      ],
    };
  },
});

manager.start();
