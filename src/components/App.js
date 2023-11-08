import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "../Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import ProgressBar from "./ProgressBar";
import FinishScreen from "./FinishScreen";

const intialStateObj = {
  questions: [], // Each question will be stored as an object with its own properties.
  status: "loading", // 'loading', 'error', 'ready', 'active', 'finished'
  index: 0, // The 'index' property will be used to keep track of the current question.
  answer: null, // The 'answer' property will be used to keep track of the user's answer to the current question when the user clicks on an option.
  points: 0, // The 'points' property will be used to keep track of the user's score.
};

// Action Types as CONSTANTS
const DATA_RECEIVED = "dataReceived";
const ERROR = "error";
const START = "start";
const FINISH = "finish";
const NEW_ANSWER = "newAnswer";
const NEXT_QUESTION = "nextQuestion";

// The reducer function allows us to update the state object with new data.
function reducer(state, action) {
  const { questions, index, points } = state;
  const { type, payload } = action;

  switch (action.type) {
    case DATA_RECEIVED:
      return { ...state, questions: payload, status: "ready" };

    case ERROR:
      return { ...state, status: "error" };

    case START:
      return { ...state, status: "active" };

    case FINISH:
      return { ...state, status: "finished" };

    case NEW_ANSWER:
      const question = questions.at(index);

      return {
        ...state,
        answer: payload,
        points:
          payload === question.correctOption
            ? points + question.points
            : points,
      };

    case NEXT_QUESTION:
      return {
        ...state,
        index: index + 1, // Increment the 'index' property by 1 when the user clicks on the 'Next Question' button.
        answer: null, // Reset the 'answer' property to null when the user clicks on the 'Next Question' button.
      };

    default:
      throw new Error(`Invalid action type: ${type}`);
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, intialStateObj);
  const { questions, status, index, answer, points } = state;

  // Derived state
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/questions");
        const data = await response.json();
        // console.log(data); // debug

        // The 'payload' is the data we want to send to the reducer function to update the state object with new data.
        const action = { type: DATA_RECEIVED, payload: data };
        dispatch(action);
      } catch (error) {
        // console.error(error); // debug
        dispatch({ type: "error" });
      }
    }

    fetchData();
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <ProgressBar
              numQuestions={numQuestions}
              index={index}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              numQuestions={numQuestions}
            />
          </>
        )}

        {status === "finished" && (
          <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} />
        )}
      </Main>
    </div>
  );
}
