require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Holdings = require("./models/HoldingSchema");
const Positions = require("./models/PositionSchema");
const Orders = require("./models/OrderSchema");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Users = require("./models/UserSchema");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://zerodha1045.netlify.app",
    "https://kite1045.netlify.app"
  ],
  credentials: true
}));

const MONGODB_URL = process.env.MONGO_URL;

mongoose.connect(MONGODB_URL)
  .then(() => console.log(" Connected with database"))
  .catch((err) => console.log(err));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(" Server running on port " + PORT);
});

app.get("/", (req, res) => {
  res.send("Hello Backend Online ");
});



app.get("/getholdings", async (req, res) => {
  const holdingdata = await Holdings.find({});
  res.json(holdingdata);
});

app.get("/getpositions", async (req, res) => {
  const positiondata = await Positions.find({});
  res.json(positiondata);
});

app.get("/getorders", async (req, res) => {
  const allorders = await Orders.find({});
  res.json(allorders);
});

app.post("/addorders", async (req, res) => {
  const neworder = new Orders(req.body);
  await neworder.save();
  res.json({ success: true });
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password, username, phone } = req.body;

    if (!email || !password || !username || !phone)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await Users.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await Users.create({ email, password, username, phone });
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    res.status(201).json({ message: "User signed up", success: true, user });

  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await Users.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    res.json({
      message: "Login successful",
      success: true,
      token,
      username: user.username
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/verifyuser", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ status: false });

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await Users.findById(decoded.id);

    if (user) return res.json({ status: true, username: user.username });
    res.json({ status: false });

  } catch {
    res.json({ status: false });
  }
});




















































