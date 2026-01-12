//Here we setting routes for Api that we implement in controller using foodRouter=express.Router()

import express from 'express'
import { addFood,listFood,removeFood} from '../controller/foodController.js';
//here we use multer package for image storage
import multer from 'multer';

//this method in express helps to creatte routes
const foodRouter=express.Router()


//Image Storage Engine from multer for storing image in uploads file
const storage=multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

//now we use above storage configuration and create upload middleware
const upload=multer({storage:storage})




//sending data to database through post method and then get response message
//Insert api 
foodRouter.post("/add",upload.single("image"),addFood)
//listfood API
foodRouter.get("/list",listFood)
//removeFood Api
foodRouter.post("/remove",removeFood)






export default foodRouter;