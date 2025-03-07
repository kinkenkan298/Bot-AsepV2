import { ChatAI } from "#asep/structures/utils/interfeces/IChatAI.js";
import { Schema, model, Model } from "mongoose";

type ChatAIModel = Model<ChatAI>;
const schema = new Schema<ChatAI, ChatAIModel>(
  {
    guildId: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    channels: [
      {
        authorId: {
          type: String,
        },
        channelId: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true },
);

const chatAIModel: ChatAIModel = model<ChatAI, ChatAIModel>(
  "chatai",
  schema,
  "ChatAI",
);

export default chatAIModel;
