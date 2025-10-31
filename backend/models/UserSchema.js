const mongoose =require("mongoose");
const bcrypt=require("bcryptjs");
const UserSchema=new mongoose. Schema({
  email:{
    type:String,
    required:true,
  },
  phone:{
    type:String,
    required:true,
  },
  username:{

    type:String,
    required:true,

  },
  password:{
    type:String,
    required:true,
  }
    
})
UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});
const Users=mongoose.model("Users",UserSchema);
module.exports=Users;