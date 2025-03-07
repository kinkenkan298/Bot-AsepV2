import { IReactRole } from "#asep/structures/utils/interfeces/IReactRole.js";
import { Model, model, Schema } from "mongoose";

type ReactRoleModel = Model<IReactRole>;
const reactRoleScheme = new Schema<IReactRole, ReactRoleModel>(
  {
    guildId: {
      type: String,
      required: true,
    },
    roleId: {
      type: String,
      required: true,
    },
    messageId: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const reactRoleModel: ReactRoleModel = model<IReactRole, ReactRoleModel>(
  "reactrole",
  reactRoleScheme,
  "ReactRole",
);

export default reactRoleModel;
