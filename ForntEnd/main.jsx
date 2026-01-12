import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
//here we import react router which will support  react Router support in the app component in our 
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './Context/StoreContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/**HERE WE ADD support of StoreContextProvider API and mout the App in this BrowerRouter and StoreContextProvider Api */}
     <StoreContextProvider>
      <App />
     </StoreContextProvider>
  </BrowserRouter>


)
