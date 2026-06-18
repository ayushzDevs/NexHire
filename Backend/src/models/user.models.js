const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username :{
        type:String,
        unique: true,
        required:true

    },

    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    },

    resumeUrl: { type: String, default: null },     // Cloudinary secure_url
    resumePublicId: { type: String, default: null }, // needed if we ever delete/replace the file
    targetRole: { type: String, default: null },
  },
  { timestamps: true }

)



const userModel = mongoose.model("userModel", userSchema);


module.exports = userModel;