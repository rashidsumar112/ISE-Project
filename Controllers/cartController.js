import userModel from "../models/userModel.js";


//Add items to Cart

const addToCart=async(req,res)=>{
try{

    let userData= await userModel.findById(req.userId);
    //from user data then we extract the cart data and then add to cart the items 
    let cartData= await userData.cartData;
    if(!cartData[req.body.itemId])
        {
        cartData[req.body.itemId]=1
        }
    else{
        cartData[req.body.itemId]+=1;
    }
    //now we pass updated cart data to this method
 await userModel.findByIdAndUpdate(req.userId,{cartData})
 res.json({success:true,message:"Added To Cart"})


}
catch (error){
    console.log(error)
    res.json({success:false,message:"Error"})


}


}


//Remove from Cart

const removeFromCart=async(req,res)=>{

    try{
        let userData= await userModel.findById(req.userId)
        //from user data then we extract the cart data and then remove to cart the items
        let cartData = await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -= 1;

        }
        //now we pass updated cart data to this method
         await userModel.findByIdAndUpdate(req.userId,{cartData})
            res.json({success:true,message:"Removed from Cart"})
    


    }
catch (error){
    console.log(error)
    res.json({success:false,message:"Error"})


}



}


//Fetch From The Cart
const getCart = async (req,res) =>{
    try{
        let userData = await userModel.findById(req.userId)
      //from user data then we extract the cart data and then remove to cart the items
        let cartData = await userData.cartData;
        res.json({success:true,cartData})
  
    }
    catch (error){
   console.log(error)
   res.json({success:false,message:"Error"})
    }

}


export {addToCart,removeFromCart,getCart}