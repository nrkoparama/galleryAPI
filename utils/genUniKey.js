const { customAlphabet } = require("nanoid");

const generateUniqueId = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  10
);

module.exports = { generateUniqueId };
