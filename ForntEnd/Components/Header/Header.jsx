//this Header file is compnenet for Home pages which then we mount in the main pages of Home.jsx file

import React from 'react'
import './Header.css';

const Header = () => {
  return (
    <div className='header'>
        <div className="header-content">
            <h2>Order Your Favorite Food Here</h2>
            <p> choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingradents and culinary expertise.our mission is to statisfy cravings and elevate your dining experince, once delicious meal at a time.</p>
            <button>View Menu</button>
        </div>

    </div>
  )
}

export default Header