import mongoose, { Date } from "mongoose";


export interface MessageType extends mongoose.Document {
  Sender: {
    id: string,
    username: string
  }
  Receiver: {
    id: string,
    username: string
  }
  Room: {
    id: mongoose.Types.ObjectId,
    username?: string
  }
  content: {
    text: string
  }
  SentAt: Date

}
var MessageSchema = new mongoose.Schema<MessageType>({
  Sender: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String,
    required: Boolean,
  },
  Receiver: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String,
  },
  Room: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    name: String,
    required: Boolean,
  },
  content: {
    text: String,
    required: Boolean,
  },
  SentAt: Date
}, { timestamps: true });

export default mongoose.model<MessageType>("Message", MessageSchema);
