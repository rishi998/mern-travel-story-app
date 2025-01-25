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
    { userid: user._id, iat:Math.floor(Date.now()/1000) },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '24d' }
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
    {userid:user._id},
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:"24d",
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
  const {userId}=req.user

  const founduser=await User.findOne({_id: userId});

  if(!founduser){
    return res.sendStatus(401);
  }
  // console.log(process.env.ACCESS_TOKEN_SECRET)
  return res.json({
    user:founduser,
    message:"welcome",
  })
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

app.post("/add-travel-story", authenticatetoken, async(req, res)=>{
  const {title, story, visitedlocation, imageurl, visiteddate} = req.body;
  const {userid}=req.user.userId;

  // validate user fields
  if(!title || !story || !visiteddate || !visitedlocation || !imageurl){
    return res.status(400).json({error:true, message:"All fields are required"});
  }
  const parsedvisiteddate=new Date(parseInt(visiteddate));
  // convert visited date from milliseconds to date object
  try{
    const travelstory=new TravelStory({
      title,
      story,
      visitedlocation,
      userid, 
      imageurl,
      visiteddate:parsedvisiteddate,
    });
    await travelstory.save();
   res.status(201).json({story: TravelStory, message:"Added successfully"});
  }catch(err){
    res.status(400).json({err:true, message:err.message});
  }
})

// edit travel story
app.post("/edit-story/:id", authenticatetoken, async(req, res)=>{
  const {id} =req.params;
  const {title, story, visitedlocation, imageurl, visiteddate} = req.body;
  const {userid}=req.user;

  // validate required fields
  if((!title || !story || !visitedlocation ||!imageurl || !visiteddate)){
    return res.status(400).json({error:true, message:"All fields are required"});
  }

  const parsedvisiteddate=new Date(parseInt(visiteddate));

  try{
    // find the travel story by ID  nd ensure it belongs to the authenticated user
    const travelstory = await TravelStory.findOne({_id: id, userid:userid});

    if(!travelstory){
      return res.status(404).json({error:true, message:"Travel story not found!"});
    }

    const placeholderImgurl=`http://localhost:3000/assets/placeholder.png`;

    travelstory.title=title;
    travelstory.story-story;
    travelstory.visitedlocation=visitedlocation;
    travelstory.imageurl=imageurl || placeholderImgurl;
    travelstory.visiteddate=parsedvisiteddate;

    await travelstory.save();
    res.status(200).json({story:travelstory, message:"Update successful"});
  }catch(err){
    res.status(500).json({error:true,message:err.message});
  }
})

app.get('/test-auth', authenticatetoken, (req, res) => {
  res.json({ message: "Token is valid", user: req.user });
});


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.listen(3000, () => console.log('Server running on port 3000'));

module.exports = app;

