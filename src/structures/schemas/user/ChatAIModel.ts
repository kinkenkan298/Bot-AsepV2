import { ChatAI } from "#asep/structures/utils/interfeces/IChatAI.js";
import mongoose, { Schema, model } from "mongoose";

const schema = new Schema<ChatAI>(
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

const ChatAIModel = mongoose.models.chatai || model("chatai", schema, "ChatAI");

export default ChatAIModel;
