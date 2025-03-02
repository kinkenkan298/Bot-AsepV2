import { Configuration } from "#asep/data/Configuration.js";
import { Embed, UsingClient } from "seyfert";
import { EmbedColors } from "seyfert/lib/common/index.js";
import { APIEmbed } from "seyfert/lib/types/index.js";

type TypeEmbed = "info" | "success" | "error" | "extra" | "warn";

interface AsepAPIEmbed extends APIEmbed {
  tipe_color: TypeEmbed;
}

export class AsepEmbed extends Embed {
  private client!: UsingClient;
  tipe_color: TypeEmbed = "info";
  constructor(data: Partial<AsepAPIEmbed> = {}, client: UsingClient) {
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
      tipe_color: this.tipe_color,
      ...data,
    };
    if (!this.data.fields) this.data.fields = [];
  }
  setType(type?: TypeEmbed): this {
    this.tipe_color = type ? type : "info";
    switch (this.tipe_color) {
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
