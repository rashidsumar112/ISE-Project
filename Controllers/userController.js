import userModel from "../models/userModel.js";
//using that we create authintication for login or sign up
import jwt from 'jsonwebtoken'
//using this package we encrypt the user password
import bcrypt from 'bcrypt'
//thruogh this we valiadate the email is valid 
import validator from 'validator'


//Login User


const loginUser= async(req,res)=>{
  const {email,password}=req.body;
  try{
    //here we check is this email exsit before
    const user= await userModel.findOne({email})
//if not exist this return false
    if(!user){
      return res.json({success:false,message:"User does not Exist"})
    }
 //in match case  bcrypt check thruogh cpmare method using current passwors and user password in db
    const isMacth=await bcrypt.compare(password,user.password)

    //if not
    if(!isMacth){
      return res.json({success:false,message:"Invalid credentials"})
    }
    //in match case or success case we create a token using user id  and then return token to user

    const token=createToken(user._id)
    res.json({success:true,token})

  }
catch (error){
  console.log(error)
  res.json({success:false,message:"Error"})

}


}
//here we token that we give in response to user after sign up that is creately automaicaly thruogh jwt pcakage
//it takes user id from mongodb and create a secret token and through jwt and returns that token
const createToken  =  (id)  =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}


//Register User

const registerUser=async(req,res)=>{

    const {name,email,password}=req.body;
    try{
        //checking user is already exist? logic implemention
        const exist=await userModel.findOne({email})
        if(exist){
            return res.json({success:false,message:"User Already exists"})
        }
  //valiadting email format & stronge password
  //this check email is a valid email and password is stronge password thruogh valiadator package
       if(!validator.isEmail(email)){
            return res.json({success:false,message:"Plz Enter a Valid Email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"Plz Enter a Stronge password"})

        }
  //hashing user password or encrypring user password
        const salt=await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(password,salt)

  //new user it goes to db
         const newUser= new userModel({
          name:name,
          email:email,
           password:hashPassword
          })
         const user=await newUser.save()
//here we pass user id to craeteToken function to create token for that id that we return to user

       const token = createToken(user._id)
        res.json({success:true,token})

    }
    catch (error) {
         console.log(error)
          res.json({success:false,message:"This is Error"})

    }


}


export {loginUser,registerUser}