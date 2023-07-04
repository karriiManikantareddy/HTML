import React from 'react'



const SubmitPage = ({emailData}) => {
    console.log("test",emailData)
  return (
    <>  
   
      <div className="card w-75">
  <div className="card-body">
    <h5 className="card-title">{emailData}</h5>
    <p className="card-text">{emailData}</p>
    <a href='#' className="btn btn-primary">Button</a>
  </div>
</div>
</>
  )
}

export default SubmitPage
