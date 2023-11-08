function FinishScreen({ points, maxPossiblePoints }) {
  // Derived state
  const percentage = Math.ceil((points / maxPossiblePoints) * 100);

  let emoji;

  // Using if-else statements
  /*
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙃";
  if (percentage >= 0 && percentage < 50) emoji = "🤨";
  if (percentage === 0) emoji = "🤦‍♂️";
  */

  switch (true) {
    case percentage === 100:
      emoji = "🥇";
      break;
    case percentage >= 80 && percentage < 100:
      emoji = "🎉";
      break;
    case percentage >= 50 && percentage < 80:
      emoji = "🙃";
      break;
    case percentage >= 0 && percentage < 50:
      emoji = "🤨";
      break;
    case percentage === 0:
      emoji = "🤦‍♂️";
      break;
    default:
      emoji = ""; // default case to handle any unexpected input
  }

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{" "}
        {maxPossiblePoints} points ({percentage}%)
      </p>

      <p className="highscore">(Highscore: X points)</p>
    </>
  );
}

export default FinishScreen;
