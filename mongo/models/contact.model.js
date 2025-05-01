const mongoose = require("mongoose");
const { Schema } = mongoose;
const { generateUniqueId } = require("../../utils/genUniKey");

const contactSchema = new Schema({
    unique_id: { type: String, default: () => generateUniqueId() },
    facebook: { type: String, required: false, default: "" },
    instagram: { type: String, required: false, default: "" },
    x: { type: String, required: false, default: "" },
    linkedIn: { type: String, required: false, default: "" },
  },{ timestamps: true });

module.exports =
  mongoose.models.contact || mongoose.model("contact", contactSchema);
