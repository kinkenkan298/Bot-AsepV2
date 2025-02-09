import { Schema, model } from "mongoose";

interface IPesan {
  pesan: string;
  balesan: string;
}

interface IAutorespon {
  guildId: string;
  autorespon: IPesan[];
}

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
