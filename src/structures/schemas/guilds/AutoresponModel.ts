import { IAutorespon } from "#asep/structures/utils/interfeces/IAutorespon.js";
import { Schema, model, Model } from "mongoose";

type AutoresponModel = Model<IAutorespon>;
const autoresponSchema: Schema = new Schema<IAutorespon, AutoresponModel>(
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

const autoresponModel: AutoresponModel = model<IAutorespon, AutoresponModel>(
  "autorespon",
  autoresponSchema,
  "AutoRespon",
);
export default autoresponModel;
