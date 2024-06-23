const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  regno: {
    type: String,
    required: true,
  },
  phoneno: {
    type: Number,
    required: true,
  },
  block: {
    type: String,
    required: true,
  },
  room: {
    type: Number,
    required: true,
  },
  mess: {
    type: String,
    required: true,
  },
  messType: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;