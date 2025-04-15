import { useState } from "react";
import { useUser } from '../../UserContext.jsx';
import './rockpaperscissors.css';


export default function RockPaperScissors() {
    const choices = ["Rock", "Paper", "Scissors"];
    const [playerChoice, setPlayerChoice] = useState("");
    const [computerChoice, setComputerChoice] = useState("");
    const [result, setResult] = useState("");
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [tieCount, setTieCount] = useState(0); 
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
            setTieCount(prev => prev + 1);
        } else if (
            (player === "Rock" && computer === "Scissors") ||
            (player === "Paper" && computer === "Rock") ||
            (player === "Scissors" && computer === "Paper")
        ) {
            setResult(`${name || "You"} win!`);
            setPlayerScore(prev => prev + 1);
        } else {
            setResult("Computer wins!");
            setComputerScore(prev => prev + 1);
        }
    };

    const handleReset = () => {
        setPlayerChoice("");
        setComputerChoice("");
        setResult("");
        setPlayerScore(0);
        setComputerScore(0);
        setTieCount(0);
    };

    return (
        <div className="rps-container">
            <h1 className="rps-title">Rock Paper Scissors</h1>
            <p className="rps-player">{name && `Player: ${name}`}</p>

            <div className="rps-scoreboard">
                <p><strong>Wins:</strong> {playerScore}</p>
                <p><strong>Losses:</strong> {computerScore}</p>
                <p><strong>Ties:</strong> {tieCount}</p>
            </div>

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

            <div className="rps-actions">
                <button onClick={handleSubmit} className="rps-submit">Submit</button>
                <button onClick={handleReset} className="rps-reset">Reset</button>
            </div>


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
