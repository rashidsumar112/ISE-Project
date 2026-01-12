import React from 'react'
import './Order.css'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'

const Order = ({url}) => {
//here we logic to display all the orders of user to this admin Order pages
const [orders,setorders]=useState([])
//this is for fecthinh all the orders of users
const fecthAllOrders=async()=>{
  const response=await axios.get(url+"/api/order/listorders")
  if(response.data.success){
    setorders(response.data.data)
    console.log(response.data.data)
  }
  else{
    toast.error("Error")

  }
}

//this for updating status for food
const statusHandler= async (event,orderId)=>{
  const response=await axios.post(url+"/api/order/status",{orderId,status:event.target.value})
  if(response.data.success){
    await fecthAllOrders()
  }

}

useEffect(()=>{
fecthAllOrders()
},[])



  return (
<div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
  {/* here we map the our orders */}
  {orders.map((order,index)=>(
<div key={index} className="order-item">

      <img src={assets.parcel_icon} alt="" />
      <div>
        <p className='order-items-food'>
  {/* here map thruogh our orders */}
      { order.items.map((item,index)=>{
        if(index===order.items.length-1){
          return item.name + " x " + item.quantity      
          }
          else{
             return item.name + " x " + item.quantity + ","
          }
      })}

        </p>

        <p className='order-item-name'>
          {order.address.firstName+ " " + order.address.lastName}
        </p>


        <div className='order-item-address'>
          <p>
          { order.address.street+ "," }</p>
          <p>
            {order.address.city+ "," + order.address.state+ "," + order.address.country+ ","+ order.address.zipcode } </p>
            </div>
            <p className='order-item-phone'>
              {order.address.phone}</p>

        

      </div>
<p>Items: {order.items.length}</p>
<p>${order.amount}</p>

{/* here we create a select menu for select "food processing" ,"out for Delivery " etc */}
<select onChange={(event)=>statusHandler(event,order._id)} value={order.status} >
  <option value="Food Processing">Food Processing</option>
  <option value="Out for delivery">Out for Delivery</option>
  <option value="Delivered">Delivered</option>
</select>

    </div>
  ))}

        </div>  
    </div>
  )
}



export default Order