import React from 'react'

const Display = ({Datas}) => {
  return (
    Datas.map((data)=>{
        const {id,title}=data
        return(
            <li key={id}>{title}</li>
        )
    })




  )}
  

export default Display;

