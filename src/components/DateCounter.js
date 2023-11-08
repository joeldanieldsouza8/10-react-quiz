import { useState, useReducer } from "react";

const intialStateObj = { count: 0, step: 1 };

function reducer(state, action) {
  console.log(`state: ${state}, action: ${action}`);

  /*
  The reducer function takes a state and an action and returns a new state.
  switch (action.type) {
    case "dec":
      return state - action.payload;
    case "inc":
      return state + action.payload;
    case "setCount":
      return action.payload;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
  */

  /* 
    Example:
    case "dec":
      return {
        ...state, // Spread out all properties of the current state object into the new object
        count: state.count - state.step, // Overwrite the count property with the new value of count in the new object
      };
  */

  // For more understanding see Notion notes:
  switch (action.type) {
    case "dec":
      return { ...state, count: state.count - state.step };
    case "inc":
      return { ...state, count: state.count + state.step };
    case "setCount":
      return { ...state, count: action.payload };
    case "setStep":
      return { ...state, step: action.payload };
    case "reset":
      return { ...intialStateObj };
    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
}

function DateCounter() {
  // const [count, setCount] = useState(0);
  // const [step, setStep] = useState(1);

  // The useReducer hook takes a reducer function and an initial state.

  const [state, dispatch] = useReducer(reducer, intialStateObj);
  const { count, step } = state;

  // This mutates the date object.
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  const dec = function () {
    // setCount((count) => count - 1);
    // setCount((count) => count - step);

    const action = { type: "dec" };

    // The dispatch function takes an action object.
    dispatch(action);
  };

  const inc = function () {
    // setCount((count) => count + 1);
    // setCount((count) => count + step);

    const action = { type: "inc" };
    dispatch(action);
  };

  const defineCount = function (e) {
    // setCount(Number(e.target.value));
    // setCount(+(e.target.value));

    const action = { type: "setCount", payload: +e.target.value };
    dispatch(action);
  };

  // See Notion notes for more understanding on how this works:
  const defineStep = function (e) {
    // setStep(+e.target.value);

    const action = { type: "setStep", payload: +e.target.value };
    dispatch(action);
  };

  const reset = function () {
    // setCount(0);
    // setStep(1);

    const action = { type: "reset" };
    dispatch(action);
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
