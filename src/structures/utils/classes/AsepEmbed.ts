import { Configuration } from "#asep/data/Configuration.js";
import { Embed, UsingClient } from "seyfert";
import { APIEmbed } from "seyfert/lib/types/index.js";

type TypeEmbed = "info" | "success" | "error" | "extra" | "warn";

export class AsepEmbed extends Embed {
  private client!: UsingClient;
  constructor(data: Partial<APIEmbed> = {}, client: UsingClient) {
    super(data);
    this.client = client;
    this.data = {
      ...data,
      author: {
        name: this.client.me.username,
        icon_url: this.client.me.avatarURL(),
      },
      footer: {
        text: this.client.me.username,
        icon_url: this.client.me.avatarURL(),
      },
      timestamp: new Date(Date.now()).toISOString(),
    };
  }
  setType(type: TypeEmbed = "info"): this {
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
    }
    return this;
  }
}
