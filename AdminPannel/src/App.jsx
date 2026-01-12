import React from 'react'
import Navbar from './Components/navbar/navbar'

import { Routes,Route } from 'react-router-dom'
import List from './Pages/List/List'
import Order from './Pages/Order/Order'
import Add from './Pages/Add/Add'
import Sidebar from './Components/Sidebar/Sidebar'
import { ToastContainer } from 'react-toastify'
import { toast} from 'react-toastify'




const App = () => {
  const url="http://localhost:4000"
  return (
    <div>
  
      <Navbar />
      <hr />
      <div className='app-content'>
       <Sidebar />
        <Routes>
          <Route path='/add' element={<Add url={url} />}/>
          <Route path='/list' element={<List  url={url} />}/>
          <Route path='/order' element={<Order  url={url} />}/>
        </Routes>
        

      </div>
    </div>
  )
}

export default App