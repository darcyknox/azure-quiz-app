import React, { useState, useEffect } from "react";
import Leaderboard from "./Leaderboard";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0); // New: track score
  const [quizComplete, setQuizComplete] = useState(false); // New: track completion
  const [resultSaved, setResultSaved] = useState(false); // Add this state

  useEffect(() => {
    // Change the URL if your function app is deployed to Azure
    fetch("http://localhost:7071/api/getQuestions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (quizComplete && !resultSaved) {
      // Send result to backend
      fetch("http://localhost:7071/api/submitResult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score,
          totalQuestions: questions.length,
          timestamp: new Date().toISOString(),
        }),
      })
        .then((res) => res.json())
        .then(() => setResultSaved(true))
        .catch(() => setResultSaved(true));
    }
  }, [quizComplete, resultSaved, score, questions.length]);

  if (loading) return <div>Loading questions...</div>;
  if (!questions.length) return <div>No questions found.</div>;

  const question = questions[current];

  const handleOptionClick = (option) => {
    setSelected(option);
    setShowAnswer(true);
    if (option === question.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      setQuizComplete(true);
    }
  };

  if (quizComplete) {
    return (
      <div>
        <h2>Quiz Complete!</h2>
        <p>
          Your score: {score} / {questions.length}
        </p>
        <Leaderboard />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "1em" }}>
        <strong>
          Question {current + 1} of {questions.length}
        </strong>
        <br />
        <span>Score: {score}</span>
      </div>
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
          <button onClick={handleNext}>
            {current < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;