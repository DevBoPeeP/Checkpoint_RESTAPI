import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
import connectDB from "./config/db.js";
import express from "express";
import bodyParser from "body-parser";

const port = process.env.PORT;
const app = express();
connectDB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import the User model
import User from "./model/user.model.js";

// GET: Return all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add a new user to the database
app.post("/users", async (req, res) => {
  const user1 = new User(req.body);
  try {
    const newUser = await user1.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Edit a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Remove a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
