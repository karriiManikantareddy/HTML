import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Edit = () => {
  const {id}= useParams();
  const [values , setValues] = useState({
    fullName:'',
    id:id,
  })
  const url = "http://localhost:3001/posts"
  useEffect(() => {
    axios
      .get(`${url}/${id}`)
      .then((res) => setValues({...values, fullName:res.data.fullName}));
  },[]);
  const navigate = useNavigate();
  const handleSubmit = (e)=>{
    e.preventDefault();
    axios
    .put(`${url}/${id}`,values)
    .then((res) =>navigate('/'));
  }
  return (
    <>
      <form  onSubmit={handleSubmit}>
        <div style={{ margin: "20px" }}>
          <input
            type="text "
            className="form-control w-50 "
            placeholder="Full Name"
            name="fullName"
            value={values.fullName}
            onChange={(e)=>setValues({...values, fullName:e.target.value})}
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default Edit;
