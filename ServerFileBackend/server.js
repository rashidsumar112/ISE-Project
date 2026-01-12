import express from 'express'
import cors from 'cors'
import 'dotenv/config'
console.log("Google API Key loaded:", process.env.GEMINI_API_KEY ? "✅ Present" : "❌ Missing");
console.log("OpenWeather Key loaded:", process.env.OPENWEATHER_API_KEY ? "✅ Present" : "❌ Missing");


import { connectDB } from './config/dbCon.js';
import foodRouter from './Routes/foodRoute.js';
import userRouter from './Routes/userRoute.js';
import cartRouter from './Routes/cartRoute.js';
import orderRouter from './Routes/orderRoute.js';
import chatbotRoutes from "./Routes/chatbotRoutes.js";



//App config:(app creation using express and setting port for it)
const app=express()
const port=4000;



//Middleware: (cors() package for making connection bw the frontend and backsend)
app.use(express.json())
app.use(cors())


//DB connection use from dbCon.js
connectDB();


//this complete routes for api using FoodRouter and in foodRouter we use addFood() function that implemnt in FoodController.js

//API Endpionts //http://localhost:4000/api/food/add
//for Admin pannel add and remove and list Food item
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))




//API endpionts for register and login for Food-del website
app.use("/api/user",userRouter)

//visa 4000 0035 6000 0008 cards dummy



//API endpionts for CartItems
app.use("/api/cart",cartRouter)


//API endpionts for place Order
app.use("/api/order",orderRouter)

//CHATBOT Route
app.use("/api/chatbot", chatbotRoutes);




//Run the express server on port that we setup above port=4000
app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`)
})

//frontend pushlished  key pk_test_51Ry3Pz4BcF6BeZxiHXFTzZ6IfSpHeaKjGYakrfI9hYsV7usg6IaPPA4o2Vtv0Klhrkq1PVa4A9IrYavBUCMbJmdN00Lq8pvqFu