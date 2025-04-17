import React, { useState, useEffect } from "react";
import HangmanDisplay from './hangmanDisplay';
import WordDisplay from './wordDisplay';
import Keyboard from './keyboard';
import { useUser } from "../../UserContext.jsx";

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
    const maxIncorrect = 6;

    useEffect (() => {
        //fetch words from API on mount
        const fetchWords = async () => {
            try {
                const response = await fetch('https://random-word-api.herokuapp.com/all');
                const data = await response.json();
                //filter words: 5-12 letters, only letters, no special char
                const filteredWords = data.filter(word => word.length >= 5 && word.length <= 12 && /^[a-zA-Z]+$/.test(word)).map(word => word.toUpperCase());
                setWordBank(filteredWords.length > 0 ? filteredWords : fallbackWords);
            } catch (error) {
                console.error('Failed to fetch words:', error);
                setWordBank(fallbackWords); //use fallback if API fails
            }
        };
        fetchWords();
    }, []);

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

