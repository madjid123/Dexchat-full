import { Document, model, Mongoose ,Schema, SchemaType, SchemaTypes, Types } from "mongoose";

interface  JoinRoomRequest extends Document {
    sender :{
        id : Types.ObjectId,
        username : string
    },
    receiver : Types.ObjectId
    // status : string
    
}
const joinRoomRequest = new Schema<JoinRoomRequest>({
    
    sender :{
        id : Types.ObjectId,
        username : SchemaTypes.String
    },
    receiver : Types.ObjectId,
    // status : {
    //     type: SchemaTypes.String,
    //     enum : ["pending", "accepted","refused"]
    // }

},{timestamps : true})
export default model("joinRoomRequest", joinRoomRequest)