import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
//Here we use logic to fecth user data and store it in state varible
const{url,token}=useContext(StoreContext)
const [data,setData]=useState([])


const fetchOrders=async ()=>{
    //this will fetch users orders from DB
    const response=await axios.post(url+"/api/order/userorders",{},{headers:{token}})
    //then store data to data varible
   setData(response.data.data)
   
}


//here we call myOrders 
useEffect(()=>{
    //if token availbale then fech orders for that user other wise it not authorized  user
    if(token){
        fetchOrders();
    }
},[token])


  return (
    <div className='my-orders'>
        <h2>My Orders</h2>
        <div className="container">
            {/* here we map our orders */}
            {data.map((order,index)=>{
                return(
                    <div key={index} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="" />
                        {/* //here all Data we gets from Db thruogh map methods  */}
                        {/* here we map our order items  */}
                        <p>{order.items.map((item,index)=>{
                            //here we gets last item 
                            if(index===order.items.length-1){
                                return item.name+" x "+item.quantity
                            }
                            //the all the items using comma
                            else{
                                return item.name+" x "+item.quantity+", "
                            }
                        })}</p>
                        
                        <p>
                            {/* //here we gets total amount */}
                            ${order.amount}.00
                        </p>
                        <p>
                            {/* here we gets items total */}
                            Items:{order.items.length}
                        </p>
                        <p><span>&#x25cf;</span><b>{order.status}</b></p>
                        {/*here we add fechOrders function in button to make this functionable that track status of food  */}
                        <button onClick={fetchOrders}>Track Order</button>

                    </div>
                )
            })}
        </div>
 
    </div>
  )
}

export default MyOrders