import axios from "axios";
import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";

//here we create a Context API for showing displaying Multiple Menu item 
export const StoreContext= createContext(null);
const StoreContextProvider=(props)=>{

//this is state varible for setting cartItems 
    const [cartItem,setcartItem]=useState({});

    //these we use in login or sign up page
    const url='http://localhost:4000'
    const [token,setToken] = useState("")


//this is state varible for get all the food items from database(mongodb) instaed from food_list
 const [food_list,setfood_list] = useState([])

 //this is state varible for search functionality
 const [searchQuery, setSearchQuery] = useState("")







   //logics for setting cart iyems and remove or getting cart items etc 
    const addToCart=async(itemId)=>{
        //if not any item in cart
        if(!cartItem[itemId]){
            //then do this
            setcartItem((prev)=>({...prev,[itemId]:1}))
        }
        //else do this 
        else{
            setcartItem((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
     //this for add the item to db with userData 
     //this for Add Api for the Cart
     //when we add item to cart it also add theese iteme with itemid in db with userData in cartData:{} with curenntly login userId that userId is gernated from token that user proivde time of login
     if(token){
        await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
     }




    }
    const removeFromCart=async(itemId)=>{
        setcartItem((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        //this for remove from cart the items
        //this for remove api for cart Items
        //So when we remove item from cart it also reomoved from db
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }
//logic for delievery amout calculation
const getCartTotalAmout=()=>{
    let TotalAmout=0;
    for(const item in cartItem){
        if(cartItem[item]>0){
            let itemInfo=food_list.find((product)=>product._id===item);
            TotalAmout+=itemInfo.price*cartItem[item]
        }
    }
    return TotalAmout;
}



//logic for gets food items from the Backend Database
const fetchFoodList = async () => {
    //here we fecth all food items from list using get methods API
    const response = await axios.get(url+"/api/food/list")
    setfood_list(response.data.data)
}

//this for when we reload the page items that added to cart not removed
//this for get Api  for cart items
//this load all the cartitems for the currently login user enterd before thruogh that user userId that it gets from token that user provide at the time of login
const loadCartData=async(token)=>{
    const response= await axios.post(url+"/api/cart/get",{},{headers:{token}})
    setcartItem(response.data.cartData)
}






//logic for loading food item after refresh untill array is [] empty and stay login by user 
useEffect(()=>{
   //when webpage loaded or refresh it loads all the food-items
     async function loadData() {
        //here we call fetchfoolist function
        await fetchFoodList();
        //this logic for not automaically logout from food-del website after refresh this prevent from removing token  local storage
        
        
   //................SERACH FOR IT FOR UNDERSTADNING ...................


        if(localStorage.getItem("token")){
        setToken(localStorage.getItem("token"))
        //this for calling the loadcartDtata function fater refresh page
        await loadCartData(localStorage.getItem("token"))
    }
      
}
  loadData(); 


},[])





//this method of desturucre
    const  contextValue={
        food_list,
        cartItem,
        setcartItem,
        addToCart,
        removeFromCart,
        getCartTotalAmout,
        url,
        token,
        setToken,
        searchQuery,
        setSearchQuery
       
    }
    return(
        <StoreContext.Provider value={contextValue}>
             {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider