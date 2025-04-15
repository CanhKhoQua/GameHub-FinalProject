import React from "react";

const Keyboard = ({ guessedLetters, handleGuess, isGameOver}) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <div className="keyboard">
            {alphabet.map((letter) => (
                <button key={letter} onClick={() => handleGuess(letter)} disabled={guessedLetters.includes(letter) || isGameOver} className={guessedLetters.includes(letter) ? 'guessed' : ''}>{letter}</button>
            ))}
        </div>
    );
};

export default Keyboard;