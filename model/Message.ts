import mongoose from "mongoose";

var MessageSchema = new mongoose.Schema({
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
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

export default mongoose.model("Message", MessageSchema);
