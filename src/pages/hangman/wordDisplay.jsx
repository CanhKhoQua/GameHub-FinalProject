import React from "react";
import './wordDisplay.css';

const WordDisplay = ({ word, guessedLetters}) => {
    return (
        <div className="word-display">
            {word.split('').map((letter, index) => (
                <span key={index} className="letter">
                    {guessedLetters.includes(letter) ? letter : '_'}
                </span>
            ))}
        </div>
    );
};

export default WordDisplay;