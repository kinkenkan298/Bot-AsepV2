import { ChatAI } from "#asep/structures/utils/interfeces/IChatAI.js";
import { Schema, model } from "mongoose";

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
          required: true,
        },
        channelId: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const ChatAIModel = model("chatai", schema, "ChatAI");

export default ChatAIModel;
