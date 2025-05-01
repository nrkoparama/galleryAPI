const mongoose = require("mongoose");
const { Schema } = mongoose;
const { STATUS_ROLES } = require("../../constants/enums");
const { generateUniqueId } = require("../../utils/genUniKey");

const categorySchema = new Schema({
  unique_id: { type: String, default: () => generateUniqueId() },
  name: { type: String, required: true },
  description: { type: String, required: true},
  status: { type: Number, enum: STATUS_ROLES, required: true, default: 1 },
}, { timestamps: true });

module.exports =
  mongoose.models.category || mongoose.model("category", categorySchema);
