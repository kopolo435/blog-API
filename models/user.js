const mongoose = require("mongoose");

const { Schema } = mongoose;

// User schema for the database
const userSchema = new Schema({
  username: { type: String, minLength: 3, maxLength: 30, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  is_admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
