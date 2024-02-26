import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import pdf from "html-pdf";
import { OfficerModel } from "./Model/Officer.js";
import { UserModel } from "./Model/User.js";
import { busModel } from "./Model/Bus.js";
import { v4 as uuidv4 } from "uuid";
import { ConnectionString, databse } from "./Eessential/Accessories.js";
import { passangerModel } from "./Model/Passangers.js";
const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(cors());

const main = async () => {
  try {
    await mongoose.connect(ConnectionString + databse);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
main();

const validateForm = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  console.log(typeof name, typeof email, typeof password, typeof phone);
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof phone !== "number"
  ) {
    return res.status(400).json({ message: "Invalid data types" });
  }
  next();
};

const hashPassword = async (password) => {
  try {
    const hashedval = await bcrypt.hash(password, saltRounds);
    return hashedval;
  } catch (er) {
    throw new Error("hashing failed ", er);
  }
};

// Create an officer
app.post("/officer/post", async (req, res) => {
  try {
    // console.log("hashPassword");
    const id = uuidv4();
    const data = req.body;
    // console.log(data.data);
    const hashedPassword = await hashPassword(data.data.password);
    // console.log(data.data.email)
    const objpresent = await OfficerModel.find({ email: data.data.email });
    console.log(objpresent);
    if (objpresent.length == 0) {
      console.log("inside if clause 1");
      const obj = await OfficerModel.create({
        ...data.data,
        password: hashedPassword,
        officerID: id,
      });
      console.log("inside if clause 2");
      res.status(201).json(obj);
    } else {
      res.status(500).json({ message: "user not found" });
    }
  } catch (err) {
    console.error("Error creating officer:", err);
    res.json({ message: "Error creating officer " + err }).status(500);
  }
});

// Delete an officer by ID
app.delete("/officer/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const obj = await OfficerModel.findOneAndDelete({ officerID: id });
    if (!obj) {
      return res.status(404).json({ message: "Officer not found" });
    }
    res.json(obj);
  } catch (err) {
    console.error("Error deleting officer:", err);
    res.status(500).json({ message: "Error deleting officer" });
  }
});

// Delete all officers
app.delete("/officer/delete", async (req, res) => {
  try {
    const obj = await OfficerModel.deleteMany();
    res.send(obj);
  } catch (err) {
    console.error("Error deleting officers:", err);
    res.status(500).json({ message: "Error deleting officers" });
  }
});

// Get all officers
app.get("/officer/get", async (req, res) => {
  try {
    const obj = await OfficerModel.find();
    res.json(obj);
  } catch (err) {
    console.error("Error fetching officers:", err);
    res.status(500).json({ message: "Error fetching officers" });
  }
});

// Update an officer by ID
app.put("/officer/put/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const obj = await OfficerModel.findOneAndUpdate(
      { officerID: id },
      updatedData,
      { new: true } // To return the updated officer document
    );
    if (!obj) {
      return res.status(404).json({ message: "Officer not found" });
    }
    res.json(obj);
  } catch (err) {
    console.error("Error updating officer:", err);
    res.status(500).json({ message: "Error updating officer" });
  }
});

// Create a user
app.post("/user/post", validateForm, async (req, res) => {
  try {
    const id = uuidv4();
    const userData = req.body;
    const newUser = await UserModel.create({
      ...userData,
      userId: id,
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Delete a user by ID
app.delete("/user/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await UserModel.findOneAndDelete({ userId });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(deletedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Delete all users
app.delete("/user/delete", async (req, res) => {
  try {
    const deletedUsers = await UserModel.deleteMany();
    res.json(deletedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting users" });
  }
});

// Get all users
app.get("/user/get", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Update a user by ID
app.put("/user/put/:id", async (req, res) => {
  try {
    const id = req.params;
    const updatedData = req.body;
    const updatedUser = await UserModel.findOneAndUpdate(
      { userId: id },
      updatedData,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
});

// login route
app.post("/login", async (req, res) => {
  console.log("object");
  const data = req.body;
  const { email, password } = data.data;
  var userdata = {};
  console.log(email, password);
  try {
    const user = await OfficerModel.findOne({ email: email });
    console.log(user);
    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      res.status(200).json({ ...user, message: "Login successful" });
    } else {
      res.status(401).json({ message: "Incorrect Password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in the user" });
  }
});

// buses

app.post("/bus/post", async (req, res) => {
  try {
    const data = req.body;
    const obj = await busModel.create({
      ...data,
      id: uuidv4(),
    });
    res.json(obj).status(200);
  } catch (er) {
    res.json(er).status(400);
  }
});

app.get("/bus/getall", async (req, res) => {
  try {
    const obj = await busModel.find();
    res.json(obj).status(200);
  } catch (er) {
    res.json(er).status(400);
  }
});

app.delete("/bus/delete", async (req, res) => {
  try {
    const obj = await busModel.deleteMany();
    res.json(obj).status(200);
  } catch (er) {
    res.json(er).status(400);
  }
});

app.get("/bus/get", async (req, res) => {
  try {
    const cond = req.query;
    const source = cond.source;
    const destination = cond.destination;
    const obj = await busModel.find({
      source: source,
      destination: destination,
    });
    res.json(obj).status(200);
  } catch (er) {
    res.json(er).status(400);
  }
});

app.post("/passanger/post", async (req, res) => {
  console.log("entered to bcknd");
  try {
    const data = req.body;
    const { date, month, year, time } = data.date;
    const { hour, minute, seconds } = time;

    const dateInstance = new Date(
      `${month} ${date}, ${year} ${hour}:${minute}:${seconds}`
    );
    console.log(dateInstance);
    if (isNaN(dateInstance)) {
      data.date = null;
    } else {
      data.date = dateInstance;
    }
    const obj = await passangerModel.create({
      ...data,
    });
    console.log(obj);
    res.json(obj).status(200);
    console.log("updated");
  } catch (er) {
    res.json(er).status(401);
  }
});
app.post("/generatepdf", (req, res) => {
  console.log("ntered");
  const { content, options } = req.body;

  pdf.create(content, options).toBuffer((err, buffer) => {
    if (err) {
      console.error("Error generating PDF:", err);
      res.status(500).send("Error generating PDF");
    } else {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
      res.send(buffer);
    }
  });
});

app.delete("/passanger/delete", async (req, res) => {
  console.log("entered to bcknd");
  try {
    const data = req.body;
    const email = data.email;
    const id = data.id;
    console.log(email, " ", id);
    const newobj = await passangerModel.find({ busId: id, email: email });
    console.log(newobj);
    const obj = await passangerModel.findOneAndDelete({
      busId: id,
      email: email,
    });
    res.json(obj).status(200);
    console.log("updated");
  } catch (er) {
    res.json(er).status(401);
  }
});

app.post("/getPassanger", async (req, res) => {
  try {
    // console.log("bcknd")
    const id = req.body.id;
    // console.log(id)
    const updatedUser = await passangerModel.find({ busId: id });
    // console.log(updatedUser)
    // res.json(updatedUser);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
});
app.listen(3000, () => {
  console.log("started");
});
