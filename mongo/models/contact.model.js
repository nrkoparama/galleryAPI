const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  facebook: { type: String, required: false, default: "" },
  instagram: { type: String, required: false, default: "" },
  x: { type: String, required: false, default: "" },
  linkedIn: { type: String, required: false, default: "" },
});

module.exports =
  mongoose.models.contact || mongoose.model("contact", contactSchema);
