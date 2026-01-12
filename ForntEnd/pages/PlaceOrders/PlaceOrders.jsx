//this is for the PlaceOrder pages which contain the information about Order when customer place order so when we click on the PlaceOrder it will move us to this page here also we import css file 
import React, { useContext, useEffect } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {

  const {getCartTotalAmout,token,food_list,cartItem,url}=useContext(StoreContext)

//here we link the placeOrder backend logics to front
//here we create a state varible to store delivery information

const [data,setData]=useState({
  firstName:"",
  lastName:"",
  email:"",
  street:"",
  city:"",
  state:"",
  zipcode:"",
  country:"",
  phone:""
})

//here we create onChange Handler to store inputs data to above state varibls
const onChangeHandler=(event)=>{
  const name= event.target.name
  const value=event.target.value
  //here {...data,[name]:value} mean we cahnge previous data to that data we gets from event
   setData(data=>({...data,[name]:value}))
}



//here we write function so when we click on Button Proccesed To Paymant it will navogates to us to place Order page
const placeOrder= async(event)=>{
event.preventDefault();
let orderItems = [];
//Here we maping and adding all the item info from food_list to  in orderItems array which we use for cartITema in plceorder
food_list.map((item)=>{
  if(cartItem[item._id] > 0){
    let itemInfo = item;
    itemInfo ["quantity"] = cartItem[item._id];
    orderItems.push(itemInfo);
  }
  
})
//here we gernate the order data
let orderData={

  //this comes from above state varible "data"
  address:data,
  //this comes from above orderItems that we get from food-list theuogh map method
  items:orderItems,
  //this we get from store context api with "2" is delivery charges
  amount:getCartTotalAmout()+2,
}
//here we send this order data to our Api and send orderData above
//these all above orderData "address:data which we gets above state varible items:we gets from cartItems using food_list map methods and total amount uaing method"amount:getCartTotalAmout() plus delivery charged 2 dollor"" and pass this order data to that end pionts which exucuted in orderController.js in backend
let response =await axios.post(url+"/api/order/place",orderData,{headers:{token}})
//here we gets response if response true we gets session-url and send to user 
//if this above response will successfully place then we gets a location of Session where we put carts and and other details for payment otherwise gets Error not get session-url

if(response.data.success){
  //this session url 
  const {session_url}=response.data
  //here we send session url to user
  window.location.replace(session_url)
}else{
  alert("Error")
}


}

const naviagte=useNavigate()


//here we logic if any person logout from website or not added any item to cart then not show Order page to him only show cart pages in both cases
//therefore we useEffect
//it executed whenever token updated other not executed
useEffect(()=>{
  //here we check two conditions
if(!token){
  //it navigates to cart page
  naviagte("/cart")
}
// or if getCartTotalAmonut is 00 it also navigate to cart page 
else if(getCartTotalAmout()===0){
  naviagte("/cart")
}


},[token])









  return (
    <form  onSubmit={placeOrder} className='place-order'>

   <div className="place-order-left">
      <p className='title'>Delivery information</p>
      <div className="multi-field">
        <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='FirstName'/>
        <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='LastName' />
      </div>
      <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' />
      <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
      <div className="multi-field">
        <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City'/>
        <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
      </div>
      <div className="multi-field">
        <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code'/>
        <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
      </div>
      <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
   </div>
   <div className="place-order-right">
       <div className="cart-total">
        <h2>Cart Total</h2>
        <div>
          <div className="cart-total-details">
            <p>SubTotal</p>
            <p>${getCartTotalAmout()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${getCartTotalAmout()===0?0:2}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>${getCartTotalAmout()===0?0:getCartTotalAmout()+2}</b>
          </div>
          
        </div>
        <button type='submit'>PROCEED TO PAYMENT</button>
      </div>
   </div>

 
    </form>
  )
}

export default PlaceOrder