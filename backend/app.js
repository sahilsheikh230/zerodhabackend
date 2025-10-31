const env=require("dotenv").config();

const express =require("express");
const mongoose=require("mongoose");
const Holdings=require("./models/HoldingSchema");
const Positions=require("./models/PositionSchema");
const Orders=require("./models/OrderSchema")
const bodyParser=require("body-parser");
const cors=require("cors");
const jwt=require( "jsonwebtoken");
//const {userVerification}=require("./utils/Verification");
const Users = require("./models/UserSchema");
const { createSecretToken } = require("./utils/SecretToken");
const bcrypt = require("bcryptjs");

const app=express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3002"], 
  credentials: true
}));
app.use(bodyParser.json());
const MONGODB_URL=process.env.MONGO_URL;
mongoose.connect(MONGODB_URL).then(()=>{
    console.log("connected with databse");

})
.catch((err)=>{
    console.log(err);
});
const port=3000;
app.listen(port,(success,error)=>{
    console.log("Server is listening");
})
app.get("/",(req,res)=>{
    res.send("heelo");
});

app.get("/getholdings",async(req,res)=>{
    const holdingdata=await Holdings.find({})

res.json(holdingdata);
});
app.get("/getpositions",async(req,res)=>{
    const positiondata=await Positions.find({})

res.json(positiondata);
})
app.get("/getorders",async(req,res)=>{
const allorders=await Orders.find({});
res.json(allorders);
})
app.post("/addorders",async(req,res)=>{
    const neworder=new Orders({
       name:req.body.name,
       qty:req.body.qty,
       price:req.body.price,
       mode:req.body.mode
    })
    await neworder.save();

})
app.post("/signup",async(req,res)=>{
    try {
    const { email, password, username, phone } = req.body;
    if (!email || !password || !username || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await Users.create({ email, password, username, phone });
    const token = jwt.sign({id:user._id},process.env.TOKEN_KEY);
    res.cookie("token", token, {
      withCredentials: true,
     httpOnly: true,
  secure: true,
  sameSite: "none",

    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });

  } catch (error) {
    console.error(error);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect password or email" });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "Incorrect password or email" });
    }
const token = jwt.sign({id:user._id},process.env.TOKEN_KEY);
 res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
  secure: true,
  sameSite: "none",

    });
    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      token,               
      username: user.username 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

 

app.get("/verifyuser", async (req, res) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) return res.json({ status: false });

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await Users.findById(decoded.id);
    if (user) return res.json({ status: true , username: user.username });
else{
    res.json({ status:false });
}
  } catch (err) {
    res.json({ status: false });
  }
});
    

































































