import { IReactRole } from "#asep/structures/utils/interfeces/IReactRole.js";
import { model, Schema } from "mongoose";

const ReactRoleScheme = new Schema<IReactRole>({
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
});

const ReactRoleModel = model("reactrole", ReactRoleScheme, "ReactRole");

export default ReactRoleModel;
