import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { getData , deleteData} from "../operations/api";
import AddUser from "../operations/addUser";

const Home = () => {
  const [data, SetData] = useState([]);
  const Data = async () => {
   let result = await getData()
       SetData(result.data)
  };
  const deleteItem = async (id)=>{
    console.log(id)
    await deleteData(id);
    Data();
  }
  useEffect(() => {
    Data();
  },[]);
 

  
  return (
    <div>
      <table className="table">
        <thead>
          <tr >
            <th scope="col">S.No</th>
            <th scope="col">Name</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const { id, fullName } = item;
            return (
              <tr key={id}>
                <th scope="row">{index + 1}</th>
                <td>{fullName}</td>
               
                <td>
                    <Link to={`/update/${id}`} className="btn btn-primary m-2" >Edit</Link>
                    <Link className="btn btn-danger" onClick={()=>deleteItem(id)}>Delete</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
