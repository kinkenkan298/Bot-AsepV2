interface ChatAIChannel {
  authorId: string;
  channelId: string;
}

export interface ChatAI {
  guildId: string;
  category: string;
  channels: ChatAIChannel[];
}
