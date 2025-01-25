const mongoose = require("mongoose");
// const { User } = require("./user.model");
const travelstorySchema=new mongoose.Schema({
  title:{type:String, required:true},
  story:{type:String, required:true},
  visitedlocation:{type:[String],default:[]},
  isfavourite:{type:Boolean, default:false},
  userid:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
  createdOn : {type:Date, default:Date.now},
  imageurl:{type:String, required:true},
  visiteddate:{type:Date, required:true},
});

module.exports=mongoose.model("TravelStory",travelstorySchema);
