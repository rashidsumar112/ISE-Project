//.....this is pages for home page when we click on home on navbar it move us to this home  pages where diffrent images, text etc will be shonwn ......
import React, { useState } from 'react'
import './Home.css'
// here we Mount the Header component from the compnets folder
//import Header from '../../components/navbar/Header/Header'
import ExplorMenu from '../../components/ExplorMenu/ExplorMenu'
import Header from '../../components/Header/Header'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'


const Home = () => {
  //here we are going to set functionality for our menu-list itme or categoory
  //here we create a state varible  and name of state varivbale will be category and  setter function function name is setCategory and equal to useState and initilaze with "All" so when we click on these category  so this specific type of category will be active so active function will be worked  
  const[category,setCategory]=useState("All");

  return (
    <div>
        <Header/>
        {/**now we pass the category and setcategory to our this ExplorMenu  compmnets as PROP */}
        <ExplorMenu category={category} setCategory={setCategory}/>
       <FoodDisplay category={category}/>
       <AppDownload />
    </div>
  )
}

export default Home