import sha256 from "js-sha256";
import mongoose from "mongoose";

export interface UserType extends mongoose.Document {
  username: string;
  image?: string;
  email: string;
  password: string;
  googleId: string;
  comparePassword: (password: string) => Promise<boolean>;
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

      // required: Boolean,
    },
  },
  { timestamps: true }
);

userSchema.index({ useraname: 1 });
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const oldpassword = sha256.sha256(password);

  return this.password === oldpassword;
};

export default mongoose.model<UserType>("User", userSchema);

