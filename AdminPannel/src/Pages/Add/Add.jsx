//this for Add food pages where we add the diffrents food to our website form adminpannel

import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
 import { ToastContainer, toast } from 'react-toastify';


const Add = ({url}) => {

  //for  start url for webite
 

//Here we   create useState functionality for store image false mean not image store at beging
const [image,setImage]=useState(false)
//Here we  create  useState functionality for store name,description,category,price etc
const [data,setData]=useState({
  name:"",
  description:"",
  price:"",
  category:"Salad",
   
})
//this is onChangeHandler
const onChangeHandler =(event)=>{
 const name =event.target.name;
  const value=event.target.value; 
  setData(data=>({...data,[name]:value}))

}

//this onsubmit function for form
const onSubmitHandler = async (event) =>{
event.preventDefault()
//now we add all the above data in to one form data
const formData = new FormData();
formData.append("name",data.name)
formData.append("description",data.description)
formData.append("price",Number(data.price))
formData.append("category",data.category)
formData.append("image",image)
const response= await axios.post(`${url}/api/food/add`,formData)
if(response.data.success){
  //this reset data to empty for next

  setData({
      name:"",
     description:"",
    price:"",
    category:"Salad",
   

  })
    
  //this  reset image for next image
  setImage(false)
  toast.success("Food Added")
  
  }
  else  {
    
    


  }




}




  return (
   

    <div className='add'>
       <ToastContainer />
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className='add-img-upload flex-col'>
           <p>Uploads Image</p>
           <label htmlFor='image'>
            {/* Here we tarnary Opertaor for showing image in image area if not image then uploads iamge shoe here */}
          <img src={ image?URL.createObjectURL(image): assets.upload_area} alt="" />
           </label>
           {/* we set onchange in this for setter image from files */}
           <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required />
        </div>
        <div className='add-product-name flex-col'>
         <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type Here'/>
        </div>
        <div className='add-product-description flex-col'>
          <p>Product Description</p>
          <textarea onChange={onChangeHandler} value={data.description} name='description' rows="6" placeholder='write contnet here' required/>
          </div>
          <div className='add-category-price'>
            <div className='add-category flex-col'>
              <p>Product Category</p>
              <select  onChange={onChangeHandler} name='category'>
                <option value='Salad'>Salad</option>
                <option value='Rolls'>Rolls</option>
                <option value='Deserts'>Deserts</option>
                <option value='Sandwich'>Sandwich</option>
                <option value='Cake'>Cake</option>
                <option value='Pure Veg'>Pure Veg</option>
                <option value='Pasta'>Pasta</option>
                 <option value='Noodles'>Noodles</option>
              </select>
              </div>

              <div className="add-price flex-col">
                <p>Product Price</p>
                <input  onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='$20' />
              </div>
            </div>
            <button type='submit' className='add-btn'>ADD</button>
      </form>
      

    </div>
  )
}

export default Add