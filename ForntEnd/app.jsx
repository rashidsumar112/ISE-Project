import React, { useState } from 'react'
//here we import navbar compnent in app.jsx folder and below in App function  we Mount navbar compnents
import Navbar from './Components/navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
//here we mount the home page,cart page and placeorder pages here
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopUp from './components/LoginPopUp/LoginPopUp'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'


const App = () => {
  //state varible for Loginpopup

  const [showLogin,setshowLogin]=useState(false)


  return (
    <>
    {showLogin?<LoginPopUp setshowLogin={setshowLogin}/>:<></>}
    <div className='app'>
     <Navbar setshowLogin={setshowLogin}/>
     {/*here we set different Routes for our diffrent PAGES */}
    <Routes>
      {/*here we set Route for our Home pages*/}
     <Route path='/' element={<Home/>}/>
     {/*here we set Route for our Cart page*/}
     <Route path='/cart' element={<Cart/>}/>
     {/*here we set Route for our PlaceOrder page*/}
     <Route path='/order' element={<PlaceOrder/>}/>
     <Route path='/verify' element={<Verify/>}/>  
     <Route path='myorders' element={<MyOrders/>}/>
    </Routes>
     </div>
     <Footer />
     </>
  )
}

export default App