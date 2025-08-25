import React, { useState } from "react";
import { questions } from "./questions";

function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleOptionClick = (option) => {
    setSelected(option);
    setShowAnswer(true);
  };

  const handleNext = () => {
    setCurrent((prev) => prev + 1);
    setSelected(null);
    setShowAnswer(false);
  };

  const question = questions[current];

  return (
    <div>
      <h2>{question.question}</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {question.options.map((option, idx) => (
          <li key={idx}>
            <button
              onClick={() => handleOptionClick(option)}
              disabled={showAnswer}
              style={{
                background:
                  showAnswer && option === question.answer
                    ? "lightgreen"
                    : showAnswer && option === selected
                    ? "salmon"
                    : "",
                margin: "0.5em 0",
                padding: "0.5em 1em",
                cursor: showAnswer ? "default" : "pointer",
              }}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
      {showAnswer && (
        <div>
          {selected === question.answer ? (
            <p style={{ color: "green" }}>Correct!</p>
          ) : (
            <p style={{ color: "red" }}>
              Incorrect. The correct answer is: <b>{question.answer}</b>
            </p>
          )}
          {current < questions.length - 1 ? (
            <button onClick={handleNext}>Next Question</button>
          ) : (
            <p>Quiz complete!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Quiz;