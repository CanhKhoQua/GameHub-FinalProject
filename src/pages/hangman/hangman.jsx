import React, { useState, useEffect } from "react";
import HangmanDisplay from './hangmanDisplay';
import WordDisplay from './wordDisplay';
import Keyboard from './keyboard';
import { useUser } from "../../UserContext.jsx";
import './hangmanGame.css';

const fallbackWords = [
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
    'BUNGEE',
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
    const [wordBank, setWordBank] = useState(null);
    const [difficulty, setDifficulty] = useState('medium');
    const maxIncorrect = 6;

    const lengthRanges = {
        easy: [5, 6],
        medium: [7, 9],
        hard: [10, 12]
    };

    useEffect (() => {
        //fetch words from API on mount
        const fetchWords = async () => {
            try {
                const response = await fetch('https://random-word-api.vercel.app/api?words500');
                const data = await response.json();
                const [min, max] = lengthRanges[difficulty];
                //filter words: 5-12 letters, only letters, no special char
                const filteredWords = data.filter(word => word.length >= min && word.length <= max && /^[a-zA-Z]+$/.test(word)).map(word => word.toUpperCase());
                setWordBank(filteredWords.length > 0 ? filteredWords : fallbackWords.filter(word => word.length >= min && word.length <= max));
            } catch (error) {
                console.error('Failed to fetch words:', error);
                const [min, max] = lengthRanges[difficulty];
                setWordBank(fallbackWords.filter(word => word.length >= min && word.length <= max)); //use fallback if API fails
            }
        };
        fetchWords();
    }, [difficulty]);

    useEffect(() => {
        if (wordBank) {
            resetGame();
        }
    }, [wordBank]);

    const resetGame = () => {
        if (!wordBank) return; //wait for wordbank to be set
        const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];
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

    //show loading state unitil wordBank is ready
    if (!wordBank || !word) {
        return;
    }

    return (
        <div>
            <h1>Hangman</h1>
            <p>Player <strong>{name || "Player"}</strong></p>
            <div className="difficulty-selector">
                <label htmlFor="difficulty">Difficulty: </label>
                <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="easy">Easy (5-6 letters)</option>
                    <option value="medium">Medium (7-9 letters)</option>
                    <option value="hard">Hard (10-12 letters)</option>
                </select>
            </div>
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

