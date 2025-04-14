import React, { useState, useEffect } from "react";
import HangmanDisplay from './hangmanDisplay';
import WordDisplay from './wordDisplay';
import Keyboard from './keyboard';

const words = [
    'ADVENTURE',
    'ALGORITHM',
    'AVOCADO',
    'BASEBALL',
    'BASKETBALL',
    'BOOKSHELF',
    'CANDLELIGHT',
    'CANYON',
    'CHOCOLATE',
    'CRICKET',
    'DATABASE',
    'DAYDREAM',
    'DUMPLING',
    'FIREPLACE',
    'FOOTBALL',
    'FOREST',
    'FRAMEWORK',
    'GLACIER',
    'GUITAR',
    'GYMNASTICS',
    'HOCKEY',
    'INTERFACE',
    'JAVASCRIPT',
    'MOUNTAIN',
    'MYSTERY',
    'NETWORK',
    'OCEAN',
    'PASTA',
    'PIZZA',
    'PROGRAMMING',
    'PUZZLE',
    'REACT',
    'RIVER',
    'RUGBY',
    'SANDWICH',
    'SERVER',
    'SOCCER',
    'SOFTWARE',
    'SUNSET',
    'SUSHI',
    'TACO',
    'TENNIS',
    'TREASURE',
    'VOLCANO',
    'VOLLEYBALL',
    'WAFFLE',
    'WATERFALL',
    'WHIRLPOOL',
    'WILDLIFE',
    'YOGURT'
  ];

const Hangman = () => {
    const [word, setWord] = useState('');
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [incorrectGuesses, setIncorrectGuesses] = useState(0);
    const maxIncorrect = 6;

    useEffect(() => {
        resetGame();
    }, []);

    const resetGame = () => {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setWord(randomWord);
        setGuessedLetters([]);
        setIncorrectGuesses(0);
    };

    const handleGuess = (letter) => {
        if (guessedLetters.includes(letter)) return;
        setGuessedLetters([...guessedLetters, letter]);
        if (!word.includes(letter)) {
            setIncorrectGuesses(incorrectGuesses + 1);
        }
    };

    const isGameWon = word.split('').every((letter) => guessedLetters.includes(letter));
    const isGameOver = incorrectGuesses >= maxIncorrect;

    return (
        <div className="hangman-game">
            <h1>Hangman</h1>
            <HangmanDisplay incorrectGuesses={incorrectGuesses} />
            <WordDisplay word={word} guessedLetters={guessedLetters} />
            <Keyboard guessedLetters={guessedLetters} handleGuess={handleGuess} isGameOver={isGameOver || isGameWon} />
            {isGameWon && (
                <div className="game-message">
                    <p>Congratulations! You won!</p>
                    <button onClick={resetGame}>Play Again</button>
                </div>
            )}
            {isGameOver && !isGameWon && (
                <div className="game-message">
                    <p>Game Over! The word was {word}.</p>
                    <button onClick={resetGame}>Play Again</button>
                </div>
            )}
        </div>
    );
};

export default Hangman;