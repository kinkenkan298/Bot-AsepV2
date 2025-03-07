import { model, Schema, Model } from "mongoose";
import { IWelcome } from "#asep/structures/utils/interfeces/ISetupChannel.js";

type SetupChannelModel = Model<IWelcome>;
const setupChannelSchema = new Schema<IWelcome, SetupChannelModel>(
  {
    guildId: {
      type: String,
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
    customMessage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const setupChannelModel: SetupChannelModel = model<IWelcome, SetupChannelModel>(
  "setupchannel",
  setupChannelSchema,
  "SetupChannel",
);

export default setupChannelModel;
