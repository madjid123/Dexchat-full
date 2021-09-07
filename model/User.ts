import mongoose from 'mongoose'

export interface UserSchema extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    googleId: string,

}
const userSchema = new mongoose.Schema<UserSchema>({
    name: {
        type: String,
        required: Boolean
    },
    email: {
        type: String,
        required: Boolean
    },
    password: {
        type: String,

    },
    googleId: {
        type: String
    }
}, { timestamps: true })




export default mongoose.model<UserSchema>('User', userSchema)