import mongoose from "mongoose";

const newschema = mongoose.Schema({
  officerID: {
    type: String,
    required : true,
    //primary key
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    unique: true,
    type: String,
    required: true,
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
    default : "Officer"
  },
});

export const OfficerModel = mongoose.model('Officers', newschema)