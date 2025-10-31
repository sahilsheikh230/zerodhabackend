const mongoose =require("mongoose");
const OrdersSchema=new mongoose. Schema({
  name:{
    type:String,
    required:true,

  },
    qty: {
        type:Number,
        required:true,
    },
    
    price: {
          type:Number,
        required:true,
    },
   mode:{
    type:"String",
   }
})
const Orders=mongoose.model("Orders",OrdersSchema);
module.exports=Orders;