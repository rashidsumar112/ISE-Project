//.......for navbar components......

import React, { useContext, useState } from 'react'

//...import css file here........

import './Navbar.css'
//chatbot component
import Chatbot from "../Chatbot/Chatbot";

//...here we import assets.jsx file where we soterd all the details abouts images and logs etc
import { assets } from '../../assets/assets'
//this for the adding link so when we click on menu it will link us to menu pages and we click on mobile-app it will links us to mobile-app page
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';

//..............NavBar Section HTML Structure..........................

const Navbar = ({setshowLogin}) => {
  //this is we getCartTotalAmout() ,token ,setToken from StoreContext Api that we used for Cart bascket Dot Appreance
  const {getCartTotalAmout,token,setToken,searchQuery,setSearchQuery}=useContext(StoreContext)


  //for underline effect for menu items
  //state varible
  const[menu,setMenu]= useState("home");
  //state varibele name is menu, and setter function name is setMenu and use state is imported from the react and we initilize the state varible woth home




//this we use to navigates to home pages after logout
const naviagte=useNavigate()


//these sre for logout function
const logOut=()=>{
  //this will remove token from local storage
  localStorage.removeItem("token");
  setToken("")
  naviagte('/')



}
//for chatbot
const [showChatbot, setShowChatbot] = useState(false);





  return (
    //............this div is for whole NavBar Section....
<div className='navbar'>
     {/* Website logo */}
   {/* <Link to='/'> <img src={assets.logo} alt="" className="logo" /></Link> */}
   <Link to='/'> <img src={assets.logo} alt="" className="logo" /></Link>
    {/* Navigation menu items */}
    <ul className="navbar-menu">
      {/* here we give  each li tag a dynamic class name and set condition here if menu===home then in this li tag we will provide active class if menu not home we will provide a empty string the similarly other all this all for giving a underline effect to ecah li tag when we click on them if state varible is home then this active will give under effect to home if menu then it will give menu and so so we here also give onClick property that automatically change the under line effect when we click on any item of li tag   */}
      {/* this for under line effect setter functions */}
    <Link  to={"/"} onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>home</Link>
    <a href='#explor-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>menu</a>
    <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>mobile-app</a>
    <a href='#footer' onClick={()=>setMenu("contact us")} className={menu==="contact us"?"active":""}>contact us</a>
    </ul>
{/* Right side icons (search and basket) */}
  <div className="navbar-right">
        {/* Search icon and input */}
        <div className="navbar-search">
          <input 
            type="text" 
            placeholder="Search food..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <img src={assets.search_icon} alt="" className="search-icon" />
        </div>
       <div className='navbar-search-icon'> 
        {/* Basket icon */}
       <Link to='/cart'> <img  src={assets.basket_icon} alt="" /></Link>
       {/**Here we provide Dynamic class name to this Down Div tag */}
        <div className={getCartTotalAmout()===0?"":"dot"}></div>
      </div>
      {/** Here we creat a button tag for Sign-in */} 
      {/* Here we create a Profile image in place of sign in when we sign in successfully */}
         {
        !token?<button onClick={()=>setshowLogin(true)}>sign in</button>
          :<div className='navbar-profile'>
          <img src={assets.profile_icon} alt="" />
          <ul className="nav-profile-dropdown">
            {/* //here we add onclick on ordersimage when we click it navigates to Myorders */}
            <li onClick={()=>naviagte("/myorders")}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
            <hr />
            <li onClick={logOut}> <img src={assets.logout_icon} alt="" /><p>LogOut</p></li>
           </ul>
           
           </div>
         }  
           {/* Chatbot icon */}
     <img
     src={assets.chatbot_icon}
       alt="Chatbot"
       className="chatbot-icon"
      onClick={() => setShowChatbot((prev) => !prev)}
/>
   </div>
   {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
</div>
  )
}

export default Navbar