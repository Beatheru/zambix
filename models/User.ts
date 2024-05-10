import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI as string);
mongoose.Promise = global.Promise;

export interface User extends mongoose.Document {
  username: string;
  password: string;
}

const userSchema = new Schema<User>({
  username: String,
  password: String
});

export const User =
  mongoose.models.User || mongoose.model<User>("User", userSchema);
