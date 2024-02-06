import mongoose from "mongoose";

export interface UserType extends mongoose.Document {
  username: string;
  image: string;
  email: string;
  password: string;
  googleId: string;
}
const userSchema = new mongoose.Schema<UserType>(
  {
    username: {
      type: String,
      required: Boolean,
    },
    email: {
      type: String,
      required: Boolean,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    image: {
      type: String,
      required: Boolean,
    },
  },
  { timestamps: true }
);

userSchema.index({ useraname: 1 });

export default mongoose.model<UserType>("User", userSchema);
