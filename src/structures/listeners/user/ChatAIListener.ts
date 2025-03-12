import { Message, UsingClient } from "seyfert";
import ChatAIModel from "#asep/structures/schemas/user/ChatAIModel.js";
import {
  GoogleGenerativeAI,
  GenerationConfig,
  SafetySetting,
  HarmCategory,
  HarmBlockThreshold,
  Content,
} from "@google/generative-ai";

const CONFIG_AI: GenerationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};
const SAFETY_SETTINGS: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function ChatAIListerner(client: UsingClient, message: Message) {
  try {
    const { channelId, guildId, content, author } = message;
    const messageMaxContentLength = 2000;
    const findChannel = await ChatAIModel.findOne({ guildId });
    if (!findChannel || findChannel.channels.length === 0) return;
    for (const ChatChannel of findChannel.channels) {
      if (ChatChannel.channelId !== channelId) return;
      if (content.length > messageMaxContentLength) return;
      if (ChatChannel.authorId !== author.id) return;
      let prevMessages = await client.messages.list(channelId, {
        limit: 15,
      });
      prevMessages.reverse();
      let historyChat: Content[] = [
        {
          role: "user",
          parts: [
            {
              text: `Kamu adalah bot atau ai bernama asep yang dirancang oleh seseorang bernama akin!`,
            },
          ],
        },
        {
          role: "model",
          parts: [{ text: `Aku ai asep yang dirancang oleh akin!` }],
        },
      ];
      prevMessages.forEach((msg) => {
        if (msg.author.id !== client.me.id && msg.author.bot) return;
        if (msg.author.id === client.me.id) {
          if (msg.content.includes("@")) return;
          historyChat.push({
            role: "model",
            parts: [{ text: `${msg.content}` }],
          });
        } else {
          if (msg.author.id === author.id) {
            historyChat.push({
              role: "user",
              parts: [{ text: `${msg.content}` }],
            });
          }
        }
      });
      client.channels
        .typing(channelId)
        .then(async () => {
          const GeminiAI = new GoogleGenerativeAI(process.env.APIKEY_GEMINI!);
          const modelAI = GeminiAI.getGenerativeModel({
            model: "gemini-1.5-pro",
          });
          const chats = modelAI.startChat({
            safetySettings: SAFETY_SETTINGS,
            generationConfig: CONFIG_AI,
            history: historyChat,
          });
          const chatting = await chats.sendMessage(content);
          const respon = chatting.response.text();
          for (let i = 0; i < respon.length; i += messageMaxContentLength) {
            const chunkMessage = respon.substring(
              i,
              i + messageMaxContentLength,
            );
            await message.write({
              content: chunkMessage,
            });
          }
        })
        .catch((e) => client.logger.error(e, "Something error guys!"));
    }
  } catch (e) {
    client.logger.error(e);
  }
}
