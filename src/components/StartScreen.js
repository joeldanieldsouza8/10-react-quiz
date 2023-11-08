function StartScreen({ numQuestions, dispatch, difficulty }) {
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

  function handleDifficultyChange(event) {
    const action = {
      type: "setDifficulty",
      payload: event.target.value,
    };
    dispatch(action);
  }

  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>

      <div>
        <label>How many questions would you like to answer?</label>
        <input
          type="number"
          placeholder="Choose a limit" // Placeholder instead of defaultValue
          onChange={handleLimitChange}
          min="1"
          max={numQuestions}
        />
      </div>

      <div>
        <label>Select Difficulty:</label>

        <select value={difficulty} onChange={handleDifficultyChange}>
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <button className="btn btn-ui" onClick={handleStartQuiz}>
        Start Quiz
      </button>
    </div>
  );
}

export default StartScreen;
