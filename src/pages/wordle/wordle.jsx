import { useState, useEffect } from "react";
import { useUser } from '../../UserContext.jsx';
import './wordles.css';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

export default function Wordle() {
  const { name } = useUser(); 
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    fetchRandomWord();
  }, []);

  const fetchRandomWord = async () => {
    try {
      const res = await fetch(`https://random-word-api.herokuapp.com/word?length=${WORD_LENGTH}`);
      const data = await res.json();
      setAnswer(data[0].toUpperCase());
    } catch (err) {
      console.error("Error fetching word:", err);
      setAnswer("REACT"); 
    }
  };

  const isValidWord = async (word) => {
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      return res.ok;
    } catch (err) {
      console.error("Word validation error:", err);
      return false;
    }
  };

  const handleInput = async (e) => {
    console.log("Key pressed:", e.key); 

    if (gameOver) return;

    if (e.key === "Enter") {
      if (currentGuess.length !== WORD_LENGTH) {
        setMessage("Guess must be 5 letters.");
        return;
      }

      const upperGuess = currentGuess.toUpperCase();
      const valid = await isValidWord(upperGuess);

      if (!valid) {
        setMessage("Not a valid word.");
        return;
      }

      const newGuesses = [...guesses, upperGuess];
      setGuesses(newGuesses);
      setCurrentGuess("");
      setMessage("");

      if (upperGuess === answer) {
        setMessage("🎉 You guessed it!");
        setGameOver(true);
      } else if (newGuesses.length >= MAX_GUESSES) {
        setMessage(`Game Over. The word was "${answer}".`);
        setGameOver(true);
      }
    } else if (e.key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(currentGuess + e.key.toUpperCase());
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleInput);
    return () => window.removeEventListener("keydown", handleInput);
  }, [currentGuess, guesses, gameOver, answer]);

  const getLetterStatus = (letter, index) => {
    if (letter === answer[index]) return "correct";
    if (answer.includes(letter)) return "close";
    return "wrong";
  };

  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setMessage("");
    fetchRandomWord(); 
  };

  return (
    <div className="wordle-container" tabIndex="0">
      <h1 className="wordle-title">Wordle</h1>
      {name && <p className="ttt-player">Player: {name}</p>}

      <div className="wordle-board">
        {[...Array(MAX_GUESSES)].map((_, rowIndex) => {
          let guess = guesses[rowIndex] || "";
          if (rowIndex === guesses.length && !gameOver) {
            guess = currentGuess;
          }
          return (
            <div className="wordle-row" key={rowIndex}>
              {[...Array(WORD_LENGTH)].map((_, colIndex) => {
                const letter = guess[colIndex] || "";
                const status = guesses[rowIndex]
                  ? getLetterStatus(letter, colIndex)
                  : "";
                return (
                  <div key={colIndex} className={`wordle-cell ${status}`}>
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {message && <p className="wordle-message">{message}</p>}

      {gameOver && (
        <button className="ttt-reset" onClick={resetGame}>
          Play Again
        </button>
      )}
    </div>
  );
}




