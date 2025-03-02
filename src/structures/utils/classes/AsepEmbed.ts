import { Configuration } from "#asep/data/Configuration.js";
import { Embed, UsingClient } from "seyfert";
import { EmbedColors } from "seyfert/lib/common/index.js";
import { APIEmbed } from "seyfert/lib/types/index.js";

type TypeEmbed = "info" | "success" | "error" | "extra" | "warn";

export class AsepEmbed extends Embed {
  private client!: UsingClient;
  constructor(data: Partial<APIEmbed> = {}, client: UsingClient) {
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
      color: Configuration.colors.info,
      timestamp: new Date(Date.now()).toISOString(),
      ...data,
    };
    if (!this.data.fields) this.data.fields = [];
  }
  setType(type?: TypeEmbed): this {
    switch (type) {
      case "success": {
        this.data.color = Configuration.colors.success;
        break;
      }
      case "info": {
        this.data.color = Configuration.colors.info;
        break;
      }
      case "error": {
        this.data.color = Configuration.colors.errors;
        break;
      }
      case "extra": {
        this.data.color = Configuration.colors.extra;
        break;
      }
      case "warn": {
        this.data.color = Configuration.colors.warn;
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
