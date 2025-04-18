import React, { useState, useEffect } from 'react';
import HangmanDisplay from './hangmanDisplay';
import WordDisplay from './wordDisplay';
import Keyboard from './keyboard';
import { useUser } from '../../UserContext.jsx';
import './HangmanGame.css';

const fallbackWords = [
  'ADVENTURE', 'ALGORITHM', 'ARCHITECTURE', 'ASTRONAUT', 'AVOCADO', 'BALLET',
  'BASEBALL', 'BASKETBALL', 'BICYCLE', 'BRILLIANT', 'BREEZE', 'BUTTERFLY',
  'BOOKSHELF', 'BUNGEE', 'CAMERA', 'CANDLELIGHT', 'CANYON', 'CHOCOLATE',
  'COFFEE', 'CRICKET', 'CURIOSITY', 'DANCE', 'DATABASE', 'DAYDREAM', 'DESERT',
  'DIAMOND', 'DUMPLING', 'ENIGMA', 'FANTASY', 'FIREPLACE', 'FOOTBALL', 'FOREST',
  'FRAMEWORK', 'GALAXY', 'GLACIER', 'GUITAR', 'GYMNASTICS', 'HISTORY', 'HOCKEY',
  'ILLUSION', 'INTERFACE', 'JAVASCRIPT', 'JAZZ', 'LANGUAGE', 'MOONLIGHT',
  'MOUNTAIN', 'MYSTERIOUS', 'MYSTERY', 'NETWORK', 'NONSTALGIA', 'NOVEL', 'OASIS',
  'OBFUSCATE', 'OCEAN', 'ORCHESTRA', 'OXYGEN', 'PAIN', 'PAINT', 'PARADOX',
  'PASTA', 'PHOTOGRAPHY', 'PIANO', 'PIZZA', 'PLANET', 'PROGRAMMING', 'PUZZLE',
  'RAINBOW', 'RAINFORREST', 'REACT', 'RIVER', 'RUGBY', 'SAFARI', 'SANDWICH',
  'SCIENCE', 'SCULPTURE', 'SECRET', 'SERVER', 'SHADOW', 'SOCCER', 'SOFTWARE',
  'SUNFLOWER', 'SUNSET', 'SUSHI', 'SYMPHONY', 'TACO', 'TELEPHONE', 'TELESCOPE',
  'TENNIS', 'THEATER', 'TREASURE', 'TROPICAL', 'UNIVERSE', 'UNPREDICTABLE',
  'UNVEIL', 'VACATION', 'VIBRANT', 'VOLCANO', 'VOLLEYBALL', 'WAFFLE',
  'WATERFALL', 'WHIRLPOOL', 'WHISPER', 'WILDLIFE', 'YOGURT'
];

export default function Hangman() {
  const { name } = useUser();
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [wordBank, setWordBank] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const storedScore = parseInt(localStorage.getItem(`highScore_${name || 'Player'}`)) || 0;
    console.log('Initial highScore:', storedScore);
    return storedScore;
  });
  const [hasScoredWin, setHasScoredWin] = useState(false);
  const maxIncorrect = 6;

  const lengthRanges = {
    easy: [5, 6],
    medium: [7, 9],
    hard: [10, 12]
  };

  const pointsPerLetter = {
    easy: 10,
    medium: 15,
    hard: 20
  };

  const winBonusMultiplier = {
    easy: 50,
    medium: 75,
    hard: 100
  };

  const isGameWon = word && word.split('').every((letter) => guessedLetters.includes(letter));
  const isGameOver = incorrectGuesses >= maxIncorrect;

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('https://random-word-api.vercel.app/api?words=500');
        const data = await response.json();
        const [min, max] = lengthRanges[difficulty];
        const filteredWords = data
          .filter(word => word.length >= min && word.length <= max && /^[a-zA-Z]+$/.test(word))
          .map(word => word.toUpperCase());
        setWordBank(filteredWords.length > 0 ? filteredWords : fallbackWords.filter(word => word.length >= min && word.length <= max));
      } catch (error) {
        console.error('Failed to fetch words:', error);
        const [min, max] = lengthRanges[difficulty];
        setWordBank(fallbackWords.filter(word => word.length >= min && word.length <= max));
      }
    };
    fetchWords();
  }, [difficulty]);

  useEffect(() => {
    if (wordBank) {
      resetGame();
    }
  }, [wordBank]);

  useEffect(() => {
    if (isGameWon && !hasScoredWin) {
      const bonus = (maxIncorrect - incorrectGuesses) * winBonusMultiplier[difficulty];
      const newScore = score + bonus;
      console.log('Game won! Score:', score, 'Bonus:', bonus, 'New Score:', newScore);
      setScore(newScore);
      if (newScore > highScore) {
        console.log('Updating highScore from', highScore, 'to', newScore);
        setHighScore(newScore);
        localStorage.setItem(`highScore_${name || 'Player'}`, newScore);
      }
      setHasScoredWin(true);
    }
  }, [isGameWon, incorrectGuesses, difficulty, maxIncorrect, name, score, highScore, hasScoredWin]);

  const resetGame = () => {
    if (!wordBank) return;
    const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];
    setWord(randomWord);
    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setScore(0);
    setHasScoredWin(false); // Reset win scoring flag
    console.log('Selected word:', randomWord);
  };

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter)) return;
    setGuessedLetters([...guessedLetters, letter]);
    if (word.includes(letter)) {
      const letterCount = word.split('').filter(l => l === letter).length;
      setScore(score + letterCount * pointsPerLetter[difficulty]);
    } else {
      setIncorrectGuesses(incorrectGuesses + 1);
      setScore(Math.max(0, score - 5));
    }
  };

  if (!wordBank || !word) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hangman-game">
      <h1>Hangman</h1>
      <p>Player <strong>{name || 'Player'}</strong></p>
      <div className="score-display">
        <p>Score: {score}</p>
        <p>High Score: {highScore}</p>
        <button
          onClick={() => {
            setHighScore(0);
            localStorage.removeItem(`highScore_${name || 'Player'}`);
          }}
        >
          Reset High Score
        </button>
      </div>
      <div className="difficulty-selector">
        <label htmlFor="difficulty">Difficulty: </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy (5-6 letters)</option>
          <option value="medium">Medium (7-9 letters)</option>
          <option value="hard">Hard (10-12 letters)</option>
        </select>
      </div>
      <HangmanDisplay incorrectGuesses={incorrectGuesses} />
      <WordDisplay word={word} guessedLetters={guessedLetters} />
      <Keyboard
        guessedLetters={guessedLetters}
        handleGuess={handleGuess}
        isGameOver={isGameOver || isGameWon}
      />
      {isGameWon && (
        <div className="game-message">
          <p>Congratulations! You won! Final Score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
      {isGameOver && !isGameWon && (
        <div className="game-message">
          <p>Game Over! The word was {word}. Final Score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}