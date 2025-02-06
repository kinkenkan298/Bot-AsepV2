import type { ContextMenuCommand } from "seyfert";
import type { SubCommand } from "seyfert";
import type { Command } from "seyfert";
import type { PermissionFlagsBits } from "seyfert/lib/types/index.js";

export type PermissionNames = keyof typeof PermissionFlagsBits;
export type NonCommandOptions = Omit<AsepOptions, "category">;
export type NonGlobalCommands = Command | ContextMenuCommand | SubCommand;

export interface AsepOptions {
  cooldown?: number;
  onlyDeveloper?: boolean;
  category?: string;
}
