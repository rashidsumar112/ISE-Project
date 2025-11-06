import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
      type:String,
      required:true,
       unique:true
    },
    password:{
        type:String,
        required:true
    },
    cartData:{
        type:Object,
        default:{}
    }
    //here minimize false otherwise cart data will not be createed because we can not provide any data for cart
},{minimize:false})
const userModel=mongoose.models.user || mongoose.model("user",userSchema)

export default userModel;