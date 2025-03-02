import { IAutorespon } from "#asep/structures/utils/interfeces/IAutorespon.js";
import mongoose, { Schema, model } from "mongoose";

const AutoresponSchema = new Schema<IAutorespon>(
  {
    guildId: {
      type: String,
      required: true,
    },
    autorespon: [
      {
        pesan: {
          type: String,
          required: true,
        },
        balesan: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const AutoresponModel =
  mongoose.models.autorespon ||
  model<IAutorespon>("autorespon", AutoresponSchema, "AutoRespon");
export default AutoresponModel;
