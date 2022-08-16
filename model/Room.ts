import mongoose from "mongoose";

export interface RoomType extends mongoose.Document {
  members: mongoose.Types.ObjectId[]

}
const RoomSchema = new mongoose.Schema<RoomType>({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
}, { timestamps: true });

export default mongoose.model<RoomType>("Room", RoomSchema);
