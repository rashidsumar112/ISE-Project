import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'

const Verify = () => {
// //to find the url parameetrs from  success_url:`${frontend_url}/verify?success=true&orderId${newOrder._id}`,
//         cancel_url:`${frontend_url}/verify?success=false&orderId${newOrder._id}`
// // we use

//Hrere we checks value of success and orderId using searchParams() from react-router-dom which takes these value from urls  
 const [searchParams,setsearchParams] = useSearchParams();

// //here we gets success and orderId value from session-url?success=true&orderId=... etc that from searchparams 
// //Here we store values
 const success = searchParams.get("success")
 const orderId = searchParams.get("orderId")

// for check purpose


// // here we get backend api from conetext api
 const {url} =  useContext(StoreContext);
const navigate = useNavigate();


 const verifyPayemnt = async() =>{
  //Here we pass both values to this end piont whci execute logic  in backeend if success=true it will redirects us to "myorders" page  in case of false "home" pages
  const response = await axios.post(url+"/api/order/verify",{success,orderId})
  if(response.data.success){
   navigate("/myorders")
  }
  else{
    navigate("/")
  }
}



// //we use this above function when is reloaded so we use 
useEffect(()=>{
verifyPayemnt()


},[])




  return (
    //this sinppner will rotate untill the payment verifed and when verifed it will returns us to myOrders page otherwise Home page
   // here we create spiiner for
    <div className='verify'>
      <div className="spiner">

      </div>


    </div>

  )
    
 }

export default Verify