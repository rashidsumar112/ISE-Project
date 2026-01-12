import express from 'express'
import authMiddleware from '../middleware/Auth.js'

import { listOrders, placeOrder,updateStatus,userOrders,verifyOrder} from '../controller/orderController.js'



const orderRouter=express.Router()


// this place order endpionts
orderRouter.post("/place",authMiddleware,placeOrder)
//this for verify order if verify it takes data to backend
orderRouter.post("/verify",verifyOrder)
//this route for  usersOrders Controller function which shows users orderss in frontEnd myOrders page
orderRouter.post("/userorders",authMiddleware,userOrders)
//this route all the orders from Db and then show all to Admin Order Pages
orderRouter.get("/listorders",listOrders)
//this route is for updating the Order Status
orderRouter.post("/status",updateStatus)






export default orderRouter;
