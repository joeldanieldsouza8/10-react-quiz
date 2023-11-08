function NextButton({ dispatch, answer, index, numQuestions }) {
  // If the user has not answered the question, don't render the button.
  if (answer === null) {
    return null;
  }

  function handleNextQuestion() {
    const action = { type: "nextQuestion" };
    dispatch(action);
  }

  function handleFinishQuiz() {
    const action = { type: "finish" };
    dispatch(action);
  }

  // If the user has answered the last question, don't render the button.
  if (index < numQuestions - 1) {
    return (
      <div>
        <button className="btn btn-ui" onClick={handleNextQuestion}>
          Next Question
        </button>
      </div>
    );
  }

  if (index === numQuestions - 1) {
    return (
      <div>
        <button className="btn btn-ui" onClick={handleFinishQuiz}>
          Finish Quiz
        </button>
      </div>
    );
  }
}

export default NextButton;
