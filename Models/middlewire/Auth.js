//this middleware for Authtication

import jwt from 'jsonwebtoken'

const authMiddleware = async(req,res,next) =>{

    // here we take token from user  and then convert it userId and then we use this userId and add,remove,get cart items 
    //this auth is for getting user id thruogh we add cart item to that user data
    const {token}=req.headers;
    if(!token)
        {
        return res.json({success:false,message:"Not Authorized Login Again"})
    }

    try{
        //here we gets user-id again in decode form and store ot in req.body.userId then we use it in add to cart function to add a item in cartData for that user Id
        const token_decode= jwt.verify(token,process.env.JWT_SECRET)
        //////////////
        req.userId=token_decode.id;
        next();

    }
    catch (error){

        console.log(error)
        res.json({success:false,message:"Error"})

    }



}

export default authMiddleware;

