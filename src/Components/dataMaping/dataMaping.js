import React from 'react'
import items from './data.json'
import "./Data.css"
const DataMaping = () => {
  return (
    <>
{items.map((item)=>{
    const {id , name, company} = item
    return(
        <div className='container'  key={id} >       
 <li>{name}</li>
 </div>
    )
})}
    </>
  )
}

export default DataMaping
