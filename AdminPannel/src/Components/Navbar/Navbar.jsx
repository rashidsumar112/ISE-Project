import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={assets.logo} alt="" />
        <img src={assets.profile_image} alt="" />

    </div>
  )
}

export default Navbar