interface IAsepColors {
  success: number;
  errors: number;
  extra: number;
  warn: number;
  info: number;
}

interface IAsepCache {
  filename: string;
  size: number;
}

interface IAsepChannels {
  guildsIds: string;
  errorsIds: string;
}

export interface IAsepConfiguration {
  defaultPrefix: string;
  prefixes: string[];
  guildIds: string[];
  developerIds: string[];
  cache: IAsepCache;
  colors: IAsepColors;
  channels: IAsepChannels;
}
