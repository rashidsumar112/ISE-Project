import orderModel from "../models/ordermodel.js";
import userModel from '../models/userModel.js'
import Stripe from 'stripe';

//This Stripe Secret key that we crated in .env file so Now we have Stripe pacake support in our website

//we store Stripe SECRET KEY value in stripe thruogh whcih we create at bottom  A Session  const session= await stripe.checkout.sessions.create({line_items:line_items, mode:'payment',}) 
const stripe= new Stripe(process.env.STRIPE_SECRET_KEY)




//Placing user order from FrontEnd
const placeOrder = async (req,res)=>{

    //this url for frontend url when process success it redirect to front page
const frontend_url= "http://localhost:5173";

    try{

        //here we save newOrder details in OrdersModel
        const newOrder= new orderModel({
            userId:req.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address,
        })
        //save data in database
      await newOrder.save();
      //when user place order then we clears user cart this logic clear cart data
      //Here we also upadte usermodel cartData when order placed cartdata will be removed
      //see this error
      //await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
      await userModel.findByIdAndUpdate(req.userId,{cartData:{}});


      //logic for create paymanet link using Stripe
     //so what ever data we get from user we use that data to create line_item that is neccssary for Stripe payemnt
      //first we create line items
      //Here we create lines-items for items in orderModel this necessary for stripe connection
      const line_items= req.body.items.map((item)=>({
       price_data:{
        currency:"inr",
        product_data:{
            name:item.name,

        },
        //here we mupltily with 280 mean we convert dollor amont in to Rs
        unit_amount:item.price*100*80
       },
       quantity:item.quantity


      }))
   //after line-items we added it one more entry whci is delivery charges
      //so here we push delivery charges to line_items
      line_items.push({
        price_data:{
            currency:"inr",
            product_data:{
                name:"Delivery Charges"
            },
            //here we mupltily with 280 mean we convert dollor amont in to Rs
            unit_amount:2*100*80
        },
        quantity:1
      })
  //here we create a session using line-items and payment
      //using this line items we create a session

      //Here we create session in this sesion user make payment if payment compelted it redirects us to this url  success_url:`${frontend_url}/verify?success=true&orderId${newOrder._id}`, or otherwise to this url cancel_url:`${frontend_url}/verify?success=false&orderId${newOrder._id}`
      const session= await stripe.checkout.sessions.create({
        line_items:line_items,
        mode:'payment',
        //if payment succesfull we redirect to this pages
        success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
      })
      
  //here we send session url in response it may be success url OR cancle url
      res.json({success:true,session_url:session.url})



    }
    catch (error){
        console.log(error)
        res.json({success:false,message:"Error"})

    }



}



//here Use  Order payment verifcation for that we create this logic


////for this in frontend we create a page verifyOrder if order is completed successfully it store data in db in case of success:false it will remove data also from db



//then we verify success value and orderId vaule from these to links AND if success=true and the in orderModel change payment value false to true and show "Paid " message otherwise also delete that orderId data from orderModel in case payment will be fail then all data will be deleted from DB  and show false in place of payment value in orderModel




 const verifyOrder = async(req,res) =>{
     //here we get orderId value and succes  value from body
     /** success_url:`${frontend_url}/verify?success=true&orderId${newOrder._id}`,
        cancel_url:`${frontend_url}/verify?success=false&orderId${newOrder._id}` */
    const {orderId,success} =req.body;
    try{
        //Here we if success is truev mean payment is successful then do this
       if(success=="true"){
        await orderModel.findByIdAndUpdate(orderId,{payment:true});
        res.json({success:true,message:"Paid"})
    }
    //else do this
    else{
        await orderModel.findByIdAndDelete(orderId)
        res.json({success:false,message:"Not Paid"})
    }


    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})

    }

}

//user orders for frontEnd
//using this controller function backend we gets all orders of specific user in Frontend MyOrders Pages
//this controller fro users orders that user make from frontEnd we controll them here
const userOrders= async(req,res) =>{
    //herevwe finds all the orders of particular user using their userId thruogh Authmddleware
    try{
        const orders= await orderModel.find({userId:req.userId});
        res.json({success:true,data:orders})

    }catch(error){
   console.log(error)
   res.json({success:false,message:"Error"})
    }

}

//here we make controller function which show for all orders for all user in Admin Order pages
//we fecth all orders from Db to admin Order pages
//API FOR FECTHING LIST OF ORDER FROM DB FOR ADMIN PANNEL ORDER PAGE
const listOrders=async(req,res)=>{

    try{
        const orders=await orderModel.find({}) 
        res.json({success:true,data:orders})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }

}


//this API is for updating the Order Status from Food Process to Out For Delivery or etc

const updateStatus=async(req,res)=>{
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})

    }
    catch(error){
  console.log(error)
  res.json({success:false,message:"Error"})
    }

}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}