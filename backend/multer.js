const multer=require('multer');
const path=require('path');

// storage configuration
const storage=multer.diskStorage({
  destination:function(req,file,cb){
    // destination folder for storing uploaded files.
    cb(null, "./uploads");
  },
  filename:function(req,file,cb){
    // unique filename
    cb(null, Date.now()+path.extname(file.originalname));
  },
});

// file filter to accept only images
const filefilter=(req,file,cb)=>{
  if(file.mimetype.startsWith("image/")){
    cb(null, true);
  }
  else{
    cb(new Error("Only images are allowed"),false);
  }
};

// Initialize multer instance
const upload = multer({storage, filefilter});

module.exports=upload;