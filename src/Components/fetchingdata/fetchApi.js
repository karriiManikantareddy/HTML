import React, { useEffect, useState } from "react";
import Display from "./display";

const FetchApi = () => {
  const [Datas, setDatas] = useState([]);
  useEffect(() => {
    fetch("https://my-json-server.typicode.com/typicode/demo/posts")
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        console.log(result);
        setDatas(result);
      });
  }, []);
 
  return (
    <>
     
      {
        Datas&&<Display Datas={Datas}/>
      }
    </>
  );
};

export default FetchApi;
