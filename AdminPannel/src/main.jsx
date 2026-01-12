import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import Swal from 'sweetalert2/dist/sweetalert2.js'
// import 'sweetalert2/src/sweetalert2.scss'
//this provide react router support in our project

import './index.css';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';






createRoot(document.getElementById('root')).render(
<BrowserRouter >
    <App />
    </BrowserRouter>
  
  
)
