import mongoose from "mongoose";

const newschema = mongoose.Schema({
  officerID: {
    type: String,
    required : true
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
    default : "Officer"
  },
});

export const OfficerModel = mongoose.model('Officers', newschema)