import mongoose from "mongoose";

const newschema = mongoose.Schema({
  busId: String,
  //primary key
  id : String,
  source: String,
  destination: String,
  stops: [String],
  busimg: String,
  departureTime: Date,
  reachingTime: Date,
  busFare : {
    type : Number,
    required : true
  }
});

export const busModel = mongoose.model("Bus", newschema);
