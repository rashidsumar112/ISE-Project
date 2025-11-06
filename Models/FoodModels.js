//We craete schema for our database here 


import mongoose from "mongoose";

const foodSchema=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:String,required:true},
    category:{type:String,required:true},
   
    
})
//if alrady model exsit then use this logic
const foodModel= mongoose.models.food || mongoose.model("food",foodSchema)

export default foodModel