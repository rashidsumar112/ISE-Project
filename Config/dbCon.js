import mongoose from 'mongoose'
//mongodb+srv://rashid:rashid12@cluster0.brkmchz.mongodb.net/?
export const connectDB=async()=>{
    await mongoose.connect('mongodb://127.0.0.1:27017/food-del').then(()=>console.log("Db Connected")).catch((err)=>console.log(err))
    
}

