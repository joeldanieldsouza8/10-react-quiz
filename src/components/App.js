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
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;

const intialStateObj = {
  questions: [], // Each question will be stored as an object with its own properties.
  status: "loading", // 'loading', 'error', 'ready', 'active', 'finished'
  index: 0, // The 'index' property will be used to keep track of the current question.
  answer: null, // The 'answer' property will be used to keep track of the user's answer to the current question when the user clicks on an option.
  points: 0, // The 'points' property will be used to keep track of the user's score.
  highScore: 0, // The 'highScore' property will be used to keep track of the user's high score.
  secondsRemaining: null, // The 'secondsRemaining' property will be used to keep track of the number of seconds remaining for the user to answer the current question.
  totalQuestions: 15, // This represents the total questions received from the backend
  selectedQuestionsLimit: null, // This represents the number of questions the user wants to answer
  difficulty: "all", // This represents the difficulty level selected by the user
};

// Action Types as CONSTANTS
const DATA_RECEIVED = "dataReceived";
const ERROR = "error";
const START = "start";
const FINISH = "finish";
const NEW_ANSWER = "newAnswer";
const NEXT_QUESTION = "nextQuestion";
const RESET = "reset";
const TICK = "tick";
const SET_QUESTION_LIMIT = "setQuestionLimit";
const SET_DIFFICULTY = "setDifficulty";

function shuffleArray(array) {
  const shuffledArray = [...array]; // Create a copy of the original array

  // Fisher-Yates (aka Knuth) Shuffle
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

// The reducer function allows us to update the state object with new data.
function reducer(state, action) {
  const {
    questions,
    index,
    points,
    highScore,
    secondsRemaining,
    status,
    selectedQuestionsLimit,
    difficulty,
  } = state;

  const { type, payload } = action;

  switch (action.type) {
    case DATA_RECEIVED:
      return { ...state, questions: payload, status: "ready" };

    case ERROR:
      return { ...state, status: "error" };

    case START:
      // Shuffle the questions array
      let shuffledQuestions = shuffleArray(questions);

      // Filter the questions array based on the difficulty level set by the user, if not set to 'all'
      if (difficulty !== "all") {
        shuffledQuestions = shuffledQuestions.filter(
          (question) => question.difficulty === difficulty
        );
      }

      // Use the total number of questions after filtering, if no limit set
      const effectiveQuestionsLimit =
        selectedQuestionsLimit || shuffledQuestions.length;

      // Slice the shuffled questions array to the limit set by the user
      const selectedQuestions = shuffledQuestions.slice(
        0,
        effectiveQuestionsLimit
      );

      return {
        ...state,
        questions: selectedQuestions, // Set the shuffled and sliced questions array to the 'questions' property.
        status: "active",
        secondsRemaining: questions.length * SECS_PER_QUESTION,
      };

    case FINISH:
      return {
        ...state,
        status: "finished",
        highScore: points > highScore ? points : highScore, // Update the 'highScore' property if the user's score is higher than the current high score.
        secondsRemaining: null, // Reset the 'secondsRemaining' property to 'null' when the user clicks on the 'Finish Quiz' button.
      };

    case NEW_ANSWER:
      const question = questions.at(index);

      return {
        ...state,
        answer: payload,
        // If the user's answer is correct, add the points for the current question to the 'points' property. Otherwise, keep the 'points' property as it is.
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

    case RESET:
      return {
        ...state,
        status: "ready",
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: null,
        highScore: Math.max(points, highScore), // Update the 'highScore' property if the user's score is higher than the current high score.
        selectedQuestionsLimit: null, // or initialStateObj.totalQuestions if you want to set it to the max available
        questions: [], // Reset the 'questions' property to an empty array when the user clicks on the 'Restart Quiz' button.
      };

    case TICK:
      return {
        ...state,
        secondsRemaining: secondsRemaining - 1,
        status: secondsRemaining === 0 ? "finished" : status, // If the 'secondsRemaining' property is 0, set the 'status' property to 'finished'. Otherwise, keep the 'status' property as it is.
        highScore:
          secondsRemaining === 0 ? Math.max(points, highScore) : highScore, // If the 'secondsRemaining' property is 0, update the 'highScore' property if the user's score is higher than the current high score. Otherwise, keep the 'highScore' property as it is.
      };

    case SET_QUESTION_LIMIT:
      return {
        ...state,
        selectedQuestionsLimit: Math.min(payload, questions.length),
      };

    case SET_DIFFICULTY:
      // Instead of directly filtering here, we simply set the difficulty
      return {
        ...state,
        difficulty: payload,
      };

    default:
      throw new Error(`Invalid action type: ${type}`);
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, intialStateObj);

  const {
    questions,
    status,
    index,
    answer,
    points,
    highScore,
    secondsRemaining,
    difficulty,
  } = state;

  // Derived state
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(() => {
    if (status === "ready" || status === "loading") {
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
          const action = { type: ERROR };
          dispatch(action);
        }
      }
      fetchData();
    }
    /* 
      By adding status to the dependency array of the useEffect hook, you ensure that every time the status changes to "ready", which will happen after a RESET, it will refetch the questions.
      This will update the questions in the state to the full original list whenever the RESET action is dispatched and the status is set to "ready".
      Include 'difficulty' in the dependency array so that it does not refetch questions when difficulty changes.
    */
  }, [status, difficulty]);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
            difficulty={difficulty}
          />
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
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
