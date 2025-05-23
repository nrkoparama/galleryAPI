const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;
const { AUTHOR_ROLES, STATUS_ROLES } = require("../../constants/enums");
const { generateUniqueId } = require("../../utils/genUniKey");

const authorSchema = new Schema(
  {
    unique_id: { type: String, default: () => generateUniqueId() },
    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      trim: true,
      match: /.+\@.+\..+/, // định dạng email
      required: true,
    },
    password: {
      type: String,
      // match: /^[A-Z](?=.*\d)(?=.*[@$!%*?&]).{7,}$/, // mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt
      required: true,
    },
    image: { type: String, default: "default-user" },
    email_verified: { type: Boolean, required: true, default: true },
    isThirdParty: { type: Boolean, require: true, default: false },
    contact_ref: { type: ObjectId, ref: "contact", required: true },
    role: { type: Number, enum: AUTHOR_ROLES, required: true, default: 0 },
    status: { type: Number, enum: STATUS_ROLES, required: true, default: 1 },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.author || mongoose.model("author", authorSchema);
