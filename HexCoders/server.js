const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔥 PUT YOUR ATLAS LINK HERE
mongoose.connect("mongodb+srv://udayverma112006_db_user1:UOFBLUZwzOm5tMiK@cluster0.znkeisj.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// User Model
const User = mongoose.model("User", {
  username: String,
  email: String,
  password: String
});

// ✅ REGISTER
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hashed
  });

  res.json({ message: "Registered Successfully" });
});

// ✅ LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "secretKey");

  res.json({ message: "Login Success", token });
});

app.listen(5000, () => console.log("Server running on port 5000"));