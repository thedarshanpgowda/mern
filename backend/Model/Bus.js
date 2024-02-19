import mongoose from "mongoose";

const newschema = mongoose.Schema({
  busId: String,
  source: String,
  destination: String,
  stops: [String],
  busimg: String,
  departureTime: Date,
  reachingTime: Date,
  isDelay: {
    type: Boolean,
    default: false,
  },
  delayTime: {
    type: Date,
    default: null,
  },
  busFare : {
    type : Number,
    required : true
  }
});

export const busModel = mongoose.model("Bus", newschema);
