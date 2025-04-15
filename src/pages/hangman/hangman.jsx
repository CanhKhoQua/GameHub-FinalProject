import React, { useState, useEffect } from "react";
import HangmanDisplay from './hangmanDisplay';
import WordDisplay from './wordDisplay';
import Keyboard from './keyboard';
import { useUser } from "../../UserContext.jsx";

const words = [
    'ADVENTURE',
    'ALGORITHM',
    'ARCHITECTURE',
    'ASTRONAUT',
    'AVOCADO',
    'BALLET',
    'BASEBALL',
    'BASKETBALL',
    'BICYCLE',
    'BRILLIANT',
    'BREEZE',
    'BUTTERFLY',
    'BOOKSHELF',
    'CAMERA',
    'CANDLELIGHT',
    'CANYON',
    'CHOCOLATE',
    'COFFEE',
    'CRICKET',
    'CURIOSITY',
    'DANCE',
    'DATABASE',
    'DAYDREAM',
    'DESERT',
    'DIAMOND',
    'DUMPLING',
    'ENIGMA',
    'FANTASY',
    'FIREPLACE',
    'FOOTBALL',
    'FOREST',
    'FRAMEWORK',
    'GALAXY',
    'GLACIER',
    'GUITAR',
    'GYMNASTICS',
    'HISTORY',
    'HOCKEY',
    'ILLUSION',
    'INTERFACE',
    'JAVASCRIPT',
    'JAZZ',
    'LANGUAGE',
    'MOONLIGHT',
    'MOUNTAIN',
    'MYSTERIOUS',
    'MYSTERY',
    'NETWORK',
    'NONSTALGIA',
    'NOVEL',
    'OASIS',
    'OBFUSCATE',
    'OCEAN',
    'ORCHESTRA',
    'OXYGEN',
    'PAIN',
    'PAINT',
    'PARADOX',
    'PASTA',
    'PHOTOGRAPHY',
    'PIANO',
    'PIZZA',
    'PLANET',
    'PROGRAMMING',
    'PUZZLE',
    'RAINBOW',
    'RAINFORREST',
    'REACT',
    'RIVER',
    'RUGBY',
    'SAFARI',
    'SANDWICH',
    'SCIENCE',
    'SCULPTURE',
    'SECRET',
    'SERVER',
    'SHADOW',
    'SOCCER',
    'SOFTWARE',
    'SUNFLOWER',
    'SUNSET',
    'SUSHI',
    'SYMPHONY',
    'TACO',
    'TELEPHONE',
    'TELESCOPE',
    'TENNIS',
    'THEATER',
    'TREASURE',
    'TROPICAL',
    'UNIVERSE',
    'UNPREDICTABLE',
    'UNVEIL',
    'VACATION',
    'VIBRANT',
    'VOLCANO',
    'VOLLEYBALL',
    'WAFFLE',
    'WATERFALL',
    'WHIRLPOOL',
    'WHISPER',
    'WILDLIFE',
    'YOGURT'
  ];

export default function Hangman() {
    const { name } = useUser();
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
            <p>Player <strong>{name || "Player"}</strong></p>
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

