import { IAutorespon } from "#asep/structures/utils/interfeces/IAutorespon.js";
import { Schema, model } from "mongoose";

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

const AutoresponModel = model<IAutorespon>(
  "autorespon",
  AutoresponSchema,
  "Autorespon",
);
export default AutoresponModel;
