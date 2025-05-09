import { IAsepConfiguration } from "../types/client/AsepConfig.js";

export const Configuration: IAsepConfiguration = {
  defaultPrefix: "asep",
  defaultLocale: "id-ID",
  prefixes: ["as!"],
  developerIds: [
    "1290584043896832054", // client id gwe
  ],
  guildIds: [
    "1335076333629210624", // bot development
    "1043102701778653264", // akatsuki
  ],
  cache: {
    filename: "commands.json",
    size: 5,
  },
  channels: {
    guildsIds: "",
    errorsIds: "",
  },
  colors: {
    info: 0x00b0f4,
    errors: 0xf72c5b,
    extra: 0x89a8b2,
    success: 0x6ec207,
    warn: 0xfcc737,
  },
};
