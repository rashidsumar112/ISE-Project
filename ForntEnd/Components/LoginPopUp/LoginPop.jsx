//for LoginPopUp
import React, {  useContext, useState } from 'react'
import './LoginPopUp.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'


const LoginPopUp = ({setshowLogin}) => {

  const {url,setToken}= useContext(StoreContext)
//
const [currState,setCurrState]=useState("Login")

//here we craete a useState  varibel to store user name ,email and password
const [data,setData]=useState({
  name:"",
  email:"",
  password:""


})


//here we ceate a onChange handler whcih takes data from inputs in store it in state varible
const onChangeHandler=(event)=>{
  const name=event.target.name;
  const value=event.target.value;

  //here we setData by giving above handler data to it
  setData(data=>({...data,[name]:value}))
}

const onLogin= async(event)=>{
  event.preventDefault()
//here we make a copy of url
  let newUrl=url;
  if(currState==="Login"){
    newUrl +="/api/user/login"
  }
  else{
    newUrl +="/api/user/register"
  }

  //this api end pionts for either login or register base on condition
  const response=await  axios.post(newUrl,data)

  if(response.data.success){
    setToken(response.data.token)
    //this will store response.data.token in "token" in localStorage in Application using loacalStorage
    localStorage.setItem("token",response.data.token)
    //this will the hide login pop after successful register or login
    setshowLogin(false)
  }
  else{
    alert(response.data.message)
  }


}







  return (
 <div className='login-popup'>
     <form  onSubmit={onLogin} className="login-popup-container">
           <div className="login-popup-title">
          <h2>{currState}</h2>
           <img onClick={()=>setshowLogin(false)} src={assets.cross_icon} alt="" />
           </div>
          <div className="login-popup-input">
         {currState==="Login"?<></>:<input name='name' 
         onChange={onChangeHandler}  value={data.name} type='text' placeholder='Your Name' required />}
        <input name='email' 
         onChange={onChangeHandler}  value={data.email} type='email' placeholder='Enter Your Email' required />
        <input name='password' 
         onChange={onChangeHandler}  value={data.password} type='password' placeholder='Enter Your Password' required />
          </div>
       <button type='submit'>{currState==="Sign Up"?"Create account":"Login"}</button>
       <div className="login-popup-condition">
        <input type='checkbox' required />
        <p>By Continuing, I agree to the terms of the use & Pravicy Policy</p>
       </div>
       {currState==="Login"?<p>Create New Account? <span onClick={()=>setCurrState("Sign Up")}>Click Here</span></p>:<p>Already Have an Account? <span onClick={()=>setCurrState("Login")}>Login Here</span></p>}
       
     </form>
</div>
  )
}

export default LoginPopUp