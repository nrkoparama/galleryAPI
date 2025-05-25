const mongoose = require("mongoose");
const {Schema} = mongoose;
const {ObjectId} = mongoose.Schema.Types;
const {AUTHOR_ROLES, STATUS_ROLES} = require("../../constants/enums");
const {generateUniqueId} = require("../../utils/genUniKey");

const authorSchema = new Schema(
    {
        unique_id: {type: String, default: () => generateUniqueId()},
        name: {type: String, trim: true, required: true},
        email: {
            type: String,
            trim: true,
            required: true,
        },
        password: {
            type: String,
            trim: true,
            default: ""
        },
        image: {type: String, default: "default-user"},
        email_verified: {type: Boolean, default: true},
        isThirdParty: {type: Boolean, required: true},
        contact_ref: {type: ObjectId, ref: "contact", required: true},
        role: {type: Number, enum: AUTHOR_ROLES, default: 0},
        status: {type: Number, enum: STATUS_ROLES, default: 1},
    },
    {timestamps: true}
);

module.exports =
    mongoose.models.author || mongoose.model("author", authorSchema);
