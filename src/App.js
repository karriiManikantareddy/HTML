import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Button from "./Components/buttonComponent/button";
import DataMaping from "./Components/dataMaping/dataMaping";
import PropsDrilling from "./Components/propsDrilling/propsDrilling";
import FormInput from "./Components/controlledComponentsInputs/formInput";
import SubmitPage from "./Components/controlledComponentsInputs/submitPage";
import UseEffect from "./Components/useEffect/useEffect";
import FetchApi from "./Components/fetchingdata/fetchApi";
import Main from "./Components/CRUD/main/main";
import { useSelector, useDispatch } from "react-redux";
import { incrementFunc, decrementFunc } from "./Components/redux/actions/index";

function App() {
  // const [count,setCount] = useState(0)
  const myState = useSelector((state) => state.changeTheNumber);
  const dispatch = useDispatch();
  return (
    <>
      <center style={{ margin: "20px" }}>Introduction to React</center>
      {/* <Button name='im from button component' color='red'/> <br/> */}
      {/* <DataMaping/> */}
      {/* <PropsDrilling count={count} setCount={setCount}/> */}
      {/* <FormInput/>
    <SubmitPage/> */}
      {/* <UseEffect/> */}
      {/* <FetchApi/> */}
      {/* <Main/> */}
      <div>
        <div
          className="btn btn-secondary"
          onClick={() => dispatch(decrementFunc())}
        >
          -
        </div>

        {myState}

        <div
          className="btn btn-primary"
          onClick={() => dispatch(incrementFunc())}
        >
          +
        </div>
      </div>
    </>
  );
}

export default App;
