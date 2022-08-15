import mongoose from "mongoose";

interface JoinRoomRequestType extends mongoose.Document {
    ReceiverId: mongoose.Types.ObjectId,
    RequesterId: mongoose.Types.ObjectId,
    State: string

}
const JoinRoomRequestSchema = new mongoose.Schema<JoinRoomRequestType>({
    ReceiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    RequesterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    State: {
        type: mongoose.Schema.Types.String,
        required: true,
        enum: ["Pending", "Rejected", "Accepted"]
    }


}, { timestamps: true })

export default mongoose.model<JoinRoomRequestType>("JoinRoomRequest", JoinRoomRequestSchema)