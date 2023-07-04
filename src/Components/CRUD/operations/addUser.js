import React, { useState } from "react";
import { postData } from "./api";
import {Link, useNavigate} from 'react-router-dom'
import Home from "../pages/home";

const AddUser = () => {
  const [initialData,setFormData] = useState({
    fullName : ''
  });



 const inputChange = (e)=>{
const {name,value} = e.target
setFormData({...initialData,[name]:value})
console.log(setFormData({...initialData,[name]:value}))
 }


 const addItem = async (initialData)=>{
  console.log(initialData)
  await postData(initialData);
}
// const navigate = useNavigate()


  return (
    <><form onSubmit={(e) => {
      e.preventDefault();
      addItem(initialData);
    //  navigate('/')
    } }>
      <div style={{ margin: "20px" }}>
        <input
          type="text "
          className="form-control w-50 "
          placeholder="Full Name"
          name="fullName"
          value={initialData.fullName}
          onChange={(e) => inputChange(e)} />{" "}

        <br />
        <button type='submit' className="btn btn-primary">Submit</button>
        <Link className="btn btn-success" to={'/'}> done </Link>
      </div>
    </form></>
   
  );
};

export default AddUser;
