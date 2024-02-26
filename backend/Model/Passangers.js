import mongoose from "mongoose";

const newschema = mongoose.Schema({
  userID: String,
  busId: { type: String, required: true },
  //primary key of busId references Passanger
  source: { type: String, required: true },
  destination: String,
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: {
    type: Date,
    required: true,
  },
  isConfirmed: { type: Boolean, default: false },
});

export const passangerModel = mongoose.model("Passanger", newschema);
