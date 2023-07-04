import React from "react";
import { useState } from "react";

const Button = ({ name, color }) => {
  const handleClick1 = () => {
    console.log("button has been clicked");
  };
  const handleClick2 = (name) => {
    console.log(`${name} has been clicked`);
  };
  const handleClick3 = () => {
    const Content = document.getElementById("content");
    Content.innerHTML = "hi iam Reddy";
  };
  const FirstName ='mani'
  const LastName ='Reddy'
  const [state, setState] = useState(FirstName);
 
  const nameChange = () => {
    if (state == FirstName) {
      setState(LastName);
    }
    else if(state==LastName){
        setState(FirstName)
    }
  };
  return (
    <>
    {/* passing name and color as a prop */}
      <button style={(color = { color })} onClick={() => handleClick1()}>
        {name}
      </button>
      <button
        style={(color = { color })}
        onClick={() => handleClick2("button2")}
      >
        {name}
      </button>
      {/* change name using click event */}
      <p id="content">hi iam manikanta</p>
      <button onClick={() => handleClick3()}>click me</button>
      {/* using usestate hook*/}
      <p>hi iam {state}</p>
      <button onClick={nameChange}>click me</button>
    </>
  );
};

export default Button;
