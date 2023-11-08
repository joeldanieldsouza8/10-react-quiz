function StartScreen({ numQuestions, dispatch }) {
  function handleLimitChange(event) {
    const newLimit = parseInt(event.target.value, 10); // Parse the string to an integer with a radix of 10 (decimal)
    const action = {
      type: "setQuestionLimit",
      // Here in the payload, we are using a ternary operator to check if the newLimit is NaN (Not a Number). 
      // If it is, we set the payload to null, otherwise we set it to the newLimit. 
      // This is because the reducer function expects a number or null for the payload. If we don't do this, the reducer function will throw an error when we try to set the selectedQuestionsLimit property to NaN.
      payload: isNaN(newLimit) ? null : newLimit,
    };
    dispatch(action);
  }

  function handleStartQuiz() {
    const action = { type: "start" };
    dispatch(action);
  }

  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>

      <div>
        <label htmlFor="question-limit">
          How many questions would you like to answer? (Max: {numQuestions})
        </label>
        <input
          type="number"
          id="question-limit" 
          placeholder="Choose a limit" // Placeholder instead of defaultValue
          onChange={handleLimitChange}
          min="1"
          max={numQuestions}
        />
      </div>

      <button className="btn btn-ui" onClick={handleStartQuiz}>
        Start Quiz
      </button>
    </div>
  );
}

export default StartScreen;
