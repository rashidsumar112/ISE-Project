//Here we list all of our food items from database

import React, { useEffect, useState } from 'react'
import './List.css'
import axios from'axios'
import { toast, ToastContainer } from 'react-toastify'

const List = ({url}) => {

  

//this for fetching data from datbase
  const [list,setList]=useState([])
  const fetchList=async () =>{
    const response=await axios.get(`${url}/api/food/list`)
    
    if(response.data.success){
      setList(response.data.data)
    }
    else{
      toast.error("Error")
    }
  }







  //Here we craete logic for Remove food from list
  const removeFood=async (foodId)=>{
   const response=await axios.post(`${url}/api/food/remove`,{id:foodId})
   //when item removed it will show updated list again 
   await fetchList();
   toast.success("Removed Successfully")

  

  }








  //now we call above fecth function using useEffect
  useEffect(()=>{
    fetchList()
  },[])



  return (
    <div className='list add flex-col'>
      <ToastContainer />
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item,index)=>{
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={()=>removeFood(item._id)} className='cursor'>X</p>
              
            </div>
          )

        })}
    </div>
   
  </div>
  )
}

export default List