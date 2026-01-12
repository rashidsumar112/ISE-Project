//this is for cart information when we click on the CART it will move us to this page where information about cart is shown like qutitty on cart etc here also import css file 
import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const {cartItem,food_list,removeFromCart,getCartTotalAmout,url}=useContext(StoreContext)
//it will navigates our "PROCEED TO CHECKOUT" to orderplace page when we click on "PROCEED TO CHECKOUT" Button

//this we import from recat-router-dom for navigates to to other pages
const navigate=useNavigate()
  return (
<div className='cart'>
    <div className="cart-items">
          <div className="cart-items-title">
           <p>Items</p>
           <p>Title</p>
           <p>Price</p>
           <p>Quantity</p>
           <p>Total</p>
           <p>Remove</p>
          </div> 
          <br />
          <hr />
           {food_list.map((item,index)=>{
            if(cartItem[item._id]>0)
            {
              return (
                 <div>
                 <div className='cart-items-title cart-items-item'>
                  <img src={url+"/images/"+item.image} alt=''/>
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItem[item._id]}</p>
                  <p>${item.price*cartItem[item._id]}</p>
                  <p  onClick={()=>removeFromCart(item._id)} className='cross'>x</p>
           </div>
                  <hr />
   </div>
              )
            }
          })} 
    </div>

    <div className="cart-bottom">
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
        <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
      </div>
      <div className="cart-promocode">
        <div>
          <p>If you have promo code, Enter here</p>
          <div className="cart-promocode-input">
            <input type="text" placeholder='promocode' />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>

</div>
  )
}

export default Cart