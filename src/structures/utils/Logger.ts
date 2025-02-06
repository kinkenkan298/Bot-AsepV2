import { Logger } from "seyfert";
import {
  gray,
  red,
  yellow,
  LogLevels,
  rgb24,
} from "seyfert/lib/common/index.js";

type ColorFunction = (text: string) => string;

const customColor: ColorFunction = (text: string) => rgb24(text, 0x8d86a8);

function addPadding(label: string): string {
  const maxLength = 6;
  const bar = "|";

  const spacesToAdd = maxLength - label.length;
  if (spacesToAdd <= 0) return bar;

  const spaces = " ".repeat(spacesToAdd);

  return spaces + bar;
}

function formatMemoryUsage(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;

  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }

  return `[RAM: ${bytes.toFixed(2)} ${units[i]}]`;
}

export function AsepLogger(
  _this: Logger,
  level: LogLevels,
  args: unknown[],
): unknown[] {
  const date: Date = new Date();
  const memory: NodeJS.MemoryUsage = process.memoryUsage();

  const label: string = Logger.prefixes.get(level) ?? "UNKNOWN";
  const timeFormat: string = `[${date.toLocaleDateString()} : ${date.toLocaleTimeString()}]`;

  const emojis: Record<LogLevels, string> = {
    [LogLevels.Debug]: "🎩",
    [LogLevels.Error]: "🏮",
    [LogLevels.Info]: "📘",
    [LogLevels.Warn]: "🔰",
    [LogLevels.Fatal]: "💀",
  };

  const colors: Record<LogLevels, ColorFunction> = {
    [LogLevels.Debug]: gray,
    [LogLevels.Error]: red,
    [LogLevels.Info]: customColor,
    [LogLevels.Warn]: yellow,
    [LogLevels.Fatal]: red,
  };

  const text = `${gray(`${timeFormat}`)} ${gray(formatMemoryUsage(memory.rss))} ${emojis[level]} [${colors[
    level
  ](label)}] ${addPadding(label)}`;

  return [text, ...args];
}
Logger.customize(AsepLogger);
Logger.dirname = "logs";

export const logger = new Logger({
  name: "[Asep]",
  saveOnFile: true,
  active: true,
});
