function ProgressBar({
  index,
  numQuestions,
  points,
  maxPossiblePoints,
  answer,
}) {

  const hasAnswered = answer !== null;

  return (
    <header className="progress">
      <progress
        value={index + Number(hasAnswered)} // If the user has answered the question, increment the value of the progress bar by 1. Otherwise, the value of the progress bar is equal to the value of the 'index' property.
        max={numQuestions}
      ></progress>

      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>

      <p>
        <strong>{points}</strong> / {maxPossiblePoints} points
      </p>
    </header>
  );
}

export default ProgressBar;
