import { useState } from "react";
import { useUser } from '../../UserContext.jsx';  // Going up two levels to src


export default function RockPaperScissors() {
    const choices = ["Rock", "Paper", "Scissors"];
    const [playerChoice, setPlayerChoice] = useState(null);
    const [computerChoice, setComputerChoice] = useState(null);
    const [result, setResult] = useState("");

    const playGame = (choice) => {
        const computer = choices[Math.floor(Math.random() * choices.length)];
        setPlayerChoice(choice);
        setComputerChoice(computer);
        determineWinner(choice, computer);
    };

    const determineWinner = (player, computer) => {
        if (player === computer) {
            setResult("It's a tie!");
        } else if (
            (player === "Rock" && computer === "Scissors") ||
            (player === "Paper" && computer === "Rock") ||
            (player === "Scissors" && computer === "Paper")
        ) {
            setResult("You win!");
        } else {
            setResult("Computer wins!");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Rock Paper Scissors</h1>
            <div className="space-x-2 mb-4">
                {choices.map((choice) => (
                    <button
                        key={choice}
                        onClick={() => playGame(choice)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        {choice}
                    </button>
                ))}
            </div>
            {playerChoice && computerChoice && (
                <div className="mt-4">
                    <p>You chose: <strong>{playerChoice}</strong></p>
                    <p>Computer chose: <strong>{computerChoice}</strong></p>
                    <p className="mt-2 text-lg font-semibold">{result}</p>
                </div>
            )}
        </div>
    );
}
