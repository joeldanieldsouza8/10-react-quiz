/* Example: The first question object in the array of questions which is at index 0.
    questions = [
        question = {
        question: "Which is the most popular JavaScript framework?",
        options: ["Angular", "React", "Svelte", "Vue"], // The correct answer is at index 1.
        correctOption: 1,
        points: 10,
        }
    ]
*/

/* 
    How does the logic work?
        1. The 'question' property of the 'question' object is passed to the 'Options' component as a prop.
        2. The 'Options' component maps over the 'options' array of the 'question' object and renders a button for each option.
        3. The 'index' property of the 'option' object is passed to the 'Options' component as a prop.
        4. When the user clicks on an option, the 'index' property of the 'option' object is passed to the 'dispatch' function as a payload.
        5. The 'dispatch' function calls the 'reducer' function and passes the 'newAnswer' action type and the 'index' property of the 'option' object as a payload.
        6. The 'reducer' function updates the 'answer' property of the 'state' object with the 'index' property of the 'option' object.
        7. The 'answer' property of the 'state' object is passed to the 'Options' component as a prop.
*/

function Options({ question, dispatch, answer }) {
  const { options, correctOption, points: point } = question;
  const hasAnswered = answer !== null;

  function handleClick(index) {
    dispatch({ type: "newAnswer", payload: index });
  }

  return (
    <div className="options">
      {options.map((option, index) => (
        <button
          className={`btn btn-option 
          ${index === answer ? "answer" : ""} 
          ${
            hasAnswered ? (index === correctOption ? "correct" : "wrong") : ""
          } `}
          key={option}
          onClick={() => handleClick(index)}
          disabled={hasAnswered} // If the user has already answered the question, disable the buttons.
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
