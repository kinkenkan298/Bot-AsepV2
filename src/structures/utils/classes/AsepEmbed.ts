import { Embed, UsingClient } from "seyfert";
import { EmbedColors } from "seyfert/lib/common/index.js";
import { APIEmbed } from "seyfert/lib/types/index.js";

type TypeEmbed = "info" | "success" | "error" | "extra" | "warn";

interface IAsepAPIEmbed extends APIEmbed {
  theme?: TypeEmbed;
}

export class AsepEmbed extends Embed {
  private client!: UsingClient;
  declare data: Partial<IAsepAPIEmbed>;
  constructor(data: Partial<IAsepAPIEmbed> = {}, client: UsingClient) {
    super(data);
    this.client = client;
    this.data = {
      author: {
        name: this.client.me.username,
        icon_url: this.client.me.avatarURL(),
      },
      footer: {
        text: this.client.me.username,
        icon_url: this.client.me.avatarURL(),
      },
      color: client.config.colors.info,
      timestamp: new Date(Date.now()).toISOString(),
      theme: "info",
      ...data,
    };
    if (!this.data.fields) this.data.fields = [];
    if (this.data.theme) this.setType(this.data.theme);
  }
  setType(type: TypeEmbed = "info"): this {
    switch (type) {
      case "success": {
        this.data.color = this.client.config.colors.success;
        break;
      }
      case "info": {
        this.data.color = this.client.config.colors.info;
        break;
      }
      case "error": {
        this.data.color = this.client.config.colors.errors;
        break;
      }
      case "extra": {
        this.data.color = this.client.config.colors.extra;
        break;
      }
      case "warn": {
        this.data.color = this.client.config.colors.warn;
        break;
      }
      default: {
        this.data.color = EmbedColors.Default;
        break;
      }
    }
    return this;
  }
}
