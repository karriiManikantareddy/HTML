import React from 'react'

const PropsDrilling = (props) => {
    const handleClick = ()=>{
        props.setCount(()=>props.count + 1)
    }
  return (
    <div className='containerBox' style={{textAlign:'center'}}>
      <button onClick={handleClick} style={{padding:20,backgroundColor:"#008CBA",border:'3px solid blue'}}>{props.count}</button>
    </div>
  )
}

export default PropsDrilling
