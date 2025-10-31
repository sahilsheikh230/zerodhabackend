const mongoose =require("mongoose");
const HoldingSchema=new mongoose. Schema({
  name:{
    type:String,
    required:true,

  },
    qty: {
        type:Number,
        required:true,
    },
    avg: {
  type:Number,
        required:true,
    },
    price: {
          type:Number,
        required:true,
    },
    net: {
          type:String,
        required:true,
    },
    day:{
         type:String,
        required:true,
    }
})
const Holdings=mongoose.model("Holdings",HoldingSchema);
module.exports=Holdings;