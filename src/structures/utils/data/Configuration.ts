import { IAsepConfiguration } from "../types/client/AsepConfig.js";

export const Configuration: IAsepConfiguration = {
  defaultPrefix: "asep",
  prefixes: ["as!"],
  developerIds: [
    "1290584043896832054", // client id gwe
  ],
  guildIds: [
    "1043102701778653264", // akatsuki
    "1302586858202595359", // my lop
    "1335076333629210624", // bot development
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
    success: 0x00b0f4,
    errors: 0xf72c5b,
    extra: 0x89a8b2,
  },
};
