import React, { useEffect, useState } from 'react'

const UseEffect = () => {
 
  const [name , setName] = useState('')
   useEffect(()=>{
console.log('updated');
   },[name]) //when name changes useEffect will update
  return (
  
    <div>
      <input type='text' value={name} onChange={(e)=>setName(e.target.value)}/>
    </div>
  )
}

export default UseEffect
