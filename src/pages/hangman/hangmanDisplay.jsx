import React from "react";

const HangmanDisplay = ({ incorrectGuesses}) => {
    const parts = [
        <circle key="head" cx="100" cy="50" r="20" fill="none" stroke="black" />,
        <line key="body" x1="100" y1="70" x2="100" y2="120" stroke="black" />,
        <line key="left-arm" x1="100" y1="80" x2="70" y2="100" stroke="black" />,
        <line key="right-arm" x1="100" y1="80" x2="130" y2="100" stroke="black" />,
        <line key="left-leg" x1="100" y1="120" x2="80" y2="150" stroke="black" />,
        <line key="right-leg" x1="100" y1="120" x2="120" y2="150" stroke="black" />,
    ];

    return (
        <svg className="hangman-display" width="200" height="200">
            {/* Gallows */}
            <line x1="20" y1="180" x2="180" y2="180" stroke="black" />
            <line x1="40" y1="180" x2="40" y2="20" stroke="black" />
            <line x1="40" y1="20" x2="100" y2="20" stroke="black" />
            <line x1="100" y1="20" x2="100" y2="30" stroke="black" />
            {/* Hangman parts */}
            {parts.slice(0, incorrectGuesses)}
        </svg>
    );
};

export default HangmanDisplay;