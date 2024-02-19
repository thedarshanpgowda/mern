import mongoose from "mongoose";

const newschema = mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
});

export const UserModel = mongoose.model("Users", newschema);
