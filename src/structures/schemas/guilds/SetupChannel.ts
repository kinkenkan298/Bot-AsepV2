import { model, Schema } from "mongoose";
import { IWelcome } from "#asep/structures/utils/interfeces/ISetupChannel.js";

const setupChannelSchema = new Schema<IWelcome>({
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
});

const SetupChannelModel = model(
  "setupchannel",
  setupChannelSchema,
  "SetupChannel",
);

export default SetupChannelModel;
