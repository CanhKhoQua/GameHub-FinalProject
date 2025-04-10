import { useState } from "react";
import { useUser } from '../../UserContext.jsx';
import '../../app.css'; // Make sure this is imported if not already

export default function RockPaperScissors() {
    const choices = ["Rock", "Paper", "Scissors"];
    const [playerChoice, setPlayerChoice] = useState("");
    const [computerChoice, setComputerChoice] = useState("");
    const [result, setResult] = useState("");
    const { name } = useUser();

    const handleSubmit = () => {
        if (!playerChoice) {
            setResult("Please select a move first.");
            return;
        }

        const computer = choices[Math.floor(Math.random() * choices.length)];
        setComputerChoice(computer);
        determineWinner(playerChoice, computer);
    };

    const determineWinner = (player, computer) => {
        if (player === computer) {
            setResult("It's a tie!");
        } else if (
            (player === "Rock" && computer === "Scissors") ||
            (player === "Paper" && computer === "Rock") ||
            (player === "Scissors" && computer === "Paper")
        ) {
            setResult(`${name || "You"} win!`);
        } else {
            setResult("Computer wins!");
        }
    };

    return (
        <div className="rps-container">
            <h1 className="rps-title">Rock Paper Scissors</h1>
            <p className="rps-player">{name && `Player: ${name}`}</p>
            <div className="rps-buttons">
                {choices.map((choice) => (
                    <button
                        key={choice}
                        onClick={() => setPlayerChoice(choice)}
                        className={`rps-button ${playerChoice === choice ? "selected" : ""}`}
                    >
                        {choice}
                    </button>
                ))}
            </div>
            <button onClick={handleSubmit} className="rps-submit">
                Submit
            </button>
            {result && (
                <div className="rps-result">
                    <p>You chose: <strong>{playerChoice}</strong></p>
                    <p>Computer chose: <strong>{computerChoice}</strong></p>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
}

