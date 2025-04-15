import { useState } from "react";
import { useUser } from "../../UserContext.jsx";
import './ttt.css';

export default function TicTacToe() {
  const { name } = useUser();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    setIsXTurn(!isXTurn);

    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
    } else if (newBoard.every(cell => cell)) {
      setWinner("Tie");
    }
  };

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]            
    ];

    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
  };

  return (
    <div className="ttt-container">
      <h1 className="ttt-title">Tic Tac Toe</h1>
      <div className="ttt-players">
  <p><strong>{name || "Player"}</strong> is <span className="ttt-x">X</span></p>
  <p><strong>Opponent</strong> is <span className="ttt-o">O</span></p>
  <p className="ttt-turn">Current Turn: {isXTurn ? <span className="ttt-x">X</span> : <span className="ttt-o">O</span>}</p>
</div>
      <div className="ttt-board">
        {board.map((cell, i) => (
          <button
          key={i}
          className={`ttt-cell ${cell === "X" ? "ttt-x" : cell === "O" ? "ttt-o" : ""}`}
          onClick={() => handleClick(i)}
        >
          {cell}
        </button>
        
        ))}
      </div>

      <div className="ttt-status">
        {winner ? (
          winner === "Tie" ? "It's a tie!" : `Winner: ${winner}`
        ) : (
          `Turn: ${isXTurn ? "X" : "O"}`
        )}
      </div>

      <button className="ttt-reset" onClick={resetGame}>Reset Game</button>
    </div>
  );
}
