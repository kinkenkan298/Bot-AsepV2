import type { ContextMenuCommand } from "seyfert";
import type { SubCommand } from "seyfert";
import type { Command } from "seyfert";
import type {
  GatewayActivityUpdateData,
  PermissionFlagsBits,
} from "seyfert/lib/types/index.js";

export type { IAsepConfiguration } from "./client/AsepConfig.js";
export type { ItemMedia, Task, Variants } from "./user/TSosmed.js";
export type PermissionNames = keyof typeof PermissionFlagsBits;
export type NonCommandOptions = Omit<AsepOptions, "category">;
export type NonGlobalCommands = Command | ContextMenuCommand | SubCommand;

export interface AsepOptions {
  cooldown?: number;
  onlyDeveloper?: boolean;
  onlyGuildOwner?: boolean;
  category?: AsepCategory;
}

export enum AsepCategory {
  Unknown = 0,
  User = 1,
  Guild = 2,
  Music = 3,
}

interface ActivityOptions {
  guilds: number;
  users: number;
  players: number;
}

export type WorkingDirectory = "src" | "dist";
export interface TConstants {
  readonly Version: string;
  readonly Dev: boolean;
  readonly Debug: boolean;

  AsepMikir(): string;
  WorkingDirectory(): WorkingDirectory;
  PesanRahasia(): string;
  Activities(options?: ActivityOptions): GatewayActivityUpdateData[];

  readonly TiktokURLregex: RegExp;
  readonly InstaURLRegex: RegExp;

  readonly responsesToxic: string[];
  readonly commandsBot: string;
}
