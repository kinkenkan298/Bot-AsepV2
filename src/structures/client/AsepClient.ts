import { Client, LimitedCollection } from "seyfert";
import { prefix } from "../utils/data/Constants.js";
import {
  ActivityType,
  ApplicationCommandType,
  PresenceUpdateStatus,
} from "seyfert/lib/types/index.js";

export class AsepClient extends Client {
  public readonly cooldown: LimitedCollection<string, number> =
    new LimitedCollection();
  constructor() {
    super({
      //globalMiddlewares: ["checkCooldowns"],
      allowedMentions: {
        replied_user: true,
        parse: ["roles"],
      },
      components: {
        defaults: {},
      },
      commands: {
        reply: () => true,
        prefix: () => {
          return [...prefix];
        },
      },
      presence: () => ({
        afk: false,
        since: Date.now(),
        status: PresenceUpdateStatus.Online,
        activities: [{ name: "Asep V2", type: ActivityType.Listening }],
      }),
    });
    this.run();
  }
  private async run(): Promise<"Asep"> {
    this.commands.onCommand = (file) => {
      const command = new file();

      if (command.type === ApplicationCommandType.PrimaryEntryPoint)
        return command;
      //if (command.onlyDeveloper) (command as NonCommandOptions).

      return command;
    };

    await this.start();

    return "Asep";
  }

  public async reload(): Promise<void> {
    this.logger.warn("Mencoba memuat ulang bot apps ...");
    try {
      await this.commands?.reloadAll();
      await this.events?.reloadAll();
      await this.components?.reloadAll();
      await this.uploadCommands({ cachePath: "./commands.json" });

      this.logger.info("Berhasil memuat ulang bot apps");
    } catch (err) {
      this.logger.fatal(err);
    }
  }
}
