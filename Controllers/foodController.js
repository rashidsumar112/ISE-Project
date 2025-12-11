 import foodModel from "../models/foodmodel.js";
 import foodRouter from "../Routes/foodRoute.js";
// //here we use fs module from node js for reading data from files
import fs from "fs";

// //logics for all Routes

//Add food to database Controller implemention
const addFood=async(req,res)=>{
    
    // aploaded file image will be store in this varibale
     let image_filename = req.file.filename;
    

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename

    })
    try{
        //this methods save food to database
        await food.save();
        res.json({success:true,message:"Food Added"})
    } catch(error){
      console.log(error)
      res.json({success:false,message:"Error",errr:error})
    };
   



}

//All Food List from database Api logic implmention
const listFood=async (req,res)=>{
    try{
        const food = await foodModel.find({});
        res.json({success:true,data:food})


    }catch (error) {

   console.log(error);
   res.json({success:false,message:"error"})
    }

}

//Remove Food Item from database API logic implemention
const removeFood=async(req,res)=>{
    try{
        //it gets id from body that we use for the remove the product
        const food=await foodModel.findById(req.body.id);
        //this will remove the image from uploads foledr
        fs.unlink(`uploads/${food.image}`,()=>{})

        //this will find id in body and delete it
        await foodModel.findByIdAndDelete(req.body.id)
        res.json({succes:true,msg:"food Remove"})

        
        

    }catch (error) {
        console.log(error)
        res.json({success:false,msg:"Error"})

   
    }

}

export   {addFood,listFood,removeFood}




