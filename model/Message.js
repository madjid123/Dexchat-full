const mongoose = require("mongoose");

var MessageSchema = new mongoose.Schema({
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact",
    required: Boolean,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: Boolean,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: Boolean,
  },
  message: {
    type: String,
    required: Boolean,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
