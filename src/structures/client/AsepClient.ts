import { Client } from "seyfert";
import {
  ActivityType,
  ApplicationCommandType,
  PresenceUpdateStatus,
} from "seyfert/lib/types/index.js";
import { Configuration } from "#asep/data/Configuration.js";
import { AsepMiddleware } from "#asep/middlwares";
import { HandleCommand } from "seyfert/lib/commands/handle.js";
import { Yuna } from "yunaforseyfert";
import { onRunError, onOptionsError } from "#asep/utils/functions/overrides.js";
import type { IAsepConfiguration, NonGlobalCommands } from "#asep/types";
import { CooldownManager } from "@slipher/cooldown";
import { ASEP_MIKIR } from "#asep/data/Constants.js";

export class AsepClient extends Client<true> {
  public cooldown: CooldownManager;

  public readonly config: IAsepConfiguration = Configuration;
  public readyTimestamp: number = 0;

  constructor() {
    super({
      globalMiddlewares: ["checkCooldown"],
      allowedMentions: {
        replied_user: false,
        parse: ["roles"],
      },
      components: {
        defaults: {
          onRunError,
        },
      },
      commands: {
        reply: () => true,
        prefix: () => {
          return [
            ...new Set([...this.config.defaultPrefix, ...this.config.prefixes]),
          ];
        },
        deferReplyResponse: ({ client }) => ({
          content: `<a:typing:1214253750093488149> **${client.me.username}** ${ASEP_MIKIR[Math.round(Math.random() * ASEP_MIKIR.length)]}`,
        }),
        defaults: {
          onOptionsError,
          onRunError,
        },
      },
      presence: () => ({
        afk: false,
        since: Date.now(),
        status: PresenceUpdateStatus.Online,
        activities: [{ name: "Asep V2", type: ActivityType.Listening }],
      }),
    });
    this.cooldown = new CooldownManager(this);

    this.run();
  }
  private async run(): Promise<"Asep"> {
    this.commands.onCommand = (file) => {
      const command = new file();

      if (command.type === ApplicationCommandType.PrimaryEntryPoint)
        return command;
      if (command.onlyDeveloper)
        (command as NonGlobalCommands).guildId = this.config.guildIds;

      return command;
    };

    this.setServices({
      middlewares: AsepMiddleware,
      cache: {
        disabledCache: {
          bans: true,
          emojis: true,
          stickers: true,
        },
      },
      handleCommand: class extends HandleCommand {
        override argsParser = Yuna.parser({
          logResult: true,
          syntax: {
            namedOptions: ["-", "--"],
          },
        });
        override resolveCommandFromContent = Yuna.resolver({
          client: this.client,
          logResult: true,
        });
      },
    });

    await this.start();

    return "Asep";
  }

  public async reload(): Promise<void> {
    this.logger.warn("Mencoba memuat ulang bot apps ...");
    try {
      await this.commands?.reloadAll();
      await this.events?.reloadAll();
      await this.components?.reloadAll();
      await this.uploadCommands({ cachePath: this.config.cache.filename });

      this.logger.info("Berhasil memuat ulang bot apps");
    } catch (err) {
      this.logger.fatal(err);
    }
  }
}
