require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const config = require('./config.json');
const jwt = require('jsonwebtoken');
const {authenticatetoken}=require("./utilities.js")
const upload = require('./multer.js')
const fs=require('fs');
const path=require('path')

mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const User = require('./models/user.model.js');
const TravelStory=require("./models/travelstory.model.js")

// Create account
app.post("/create-account", async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: true, message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    fullname,
    email,
    password: hashedPassword,
  });

  await user.save();

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '72h' }
  );

  return res.status(201).json({
    error: false,
    user: { fullname: user.fullname, email: user.email },
    accessToken,
    message: "Registration successful"
  });
});

// login
app.post("/login", async (req, res) => {
  const {email, password}=req.body;

  if(!email || !password){
    return res.status(400).json({message:"Email and password are required"});
  }

  const user=await User.findOne({email});
  if(!user){
    return res.status(400).json({message:"User not found"});
  }

  const ispasswordvalid=await bcrypt.compare(password, user.password);
  if(!ispasswordvalid){
    return res.status(400).json({message:"Wrong Password"});
  }

  const accessToken=jwt.sign(
    {userId:user._id},
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:"72",
    }
  );

  return res.json({
    error:false,
    message:"Login Successful",
    user:{fullname:user.fullname, email:user.email},
    accessToken,
  })
})

// get user 
app.get("/get-user", authenticatetoken, async(req, res)=>{
  const {userid}=req.user

  const isuser=await User.findOne({_id: userid});

  if(!isuser){
    return res.sendStatus(401);
  }

  return res.json({
    user:isuser,
    message:""
  })
})

app.post("/add-travel-story", authenticatetoken, async(req, res)=>{
  const {title, story, visitedlocation, imageurl, visiteddate} = req.body;

  // validate user fields
  if(!title || !story || !visiteddate || !visitedlocation || !imageurl){
    return res.status(400).json({error:true, message:"All fields are required"});
  }

  // convert visited date from milliseconds to date object
  try{
    const  parsedvisiteddate=new TravelStory({
      title,
      story,
      visitedlocation,
      userid,
      imageurl,
      visiteddate:parsedvisiteddate,
    });
    await travelstoryModel.save();
   res.status(201).json({story: TravelStory, message:"Added successfully"});
  }catch(err){
    res.status(400).json({err:true, message:err.message});
  }
})

app.get("/get-all-stories", authenticatetoken, async(req, res)=>{
  try{
    const travelstories=await TravelStory.find({userid:userid}).sort({isfavourite:-1});
    res.status(200).json({stories:travelstories});
  }catch(err){
    res.status(500).json({error:true,message:err.message})
  }
})

app.post("/image-upload",upload.single("image"), async(req, res)=>{
  try{
    if(!req.file){
      return res.status(400).json({error:true, message:"No image uploaded"});
    }

    const imageurl=`http://localhost:3000/uploads/${req.file.filename}`;

    res.status(201).json({imageurl});
  }catch(err){
    res.status(500).json({error:true, message:err.message});
  }
})

//delete an image from the uploaded folder
app.delete("/delete-image", async(req,res)=>{
  const {imageurl}=req.query;

  if(!imageurl){
    return res.status(400).json({error:true, message:"Image url is required"});
  }

  try{
    // extract filename using image url
    const filename=path.basename(imageurl);

    // define the file path
    const filepath=path.join(__dirname,"uploads",filename);

    // check if file exists
    if(fs.existsSync(filepath)){
      // delete file from uploads folder
      fs.unlinkSync(filepath);
      res.status(200).json({message:"Image deleted successfully"});
    }else{
      res.status(400).json({error:true, message:"Image not found"});
    }
  }catch(err){
    res.status(500).json({error:true, message:err.message});
  } 
 })

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.listen(3000, () => console.log('Server running on port 3000'));

module.exports = app;
