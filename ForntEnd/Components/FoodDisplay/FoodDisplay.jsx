import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {
  //here we use food_list show diferrent items details from StoreContext
    const {food_list, searchQuery}=useContext(StoreContext)
  return (
    <div className='food-display' id='food-display'>
    <h2>Top Dishes Near You</h2>
    <div className='food-display-list'>
      {/**here we use map method to acces all the items from food_list and then we in return we mount FoodItem componnets and we pass it  diffenet props parameters */}
      {food_list.map((item,index)=>{
        //check if category matches or if search query matches the food name or description
        const categoryMatch = category==="All" || category===item.category;
        const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        if(categoryMatch && searchMatch){
           return(
        <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />)
    
        }
      })}

    </div>
    </div>
  )
}

export default FoodDisplay