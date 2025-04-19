import { useEffect, useState } from "react";
import { useUser } from "../../UserContext.jsx";
import "./ttt.css";

const API_URL = "https://game-room-api.fly.dev/api/rooms";

export default function TicTacToe() {
  const { name } = useUser();
  const [roomId, setRoomId] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [gameState, setGameState] = useState(null);

  // Create a new room
  const createRoom = async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        initialState: {
          player1: name,
          player2: null,
          board: Array(9).fill(null),
          isXTurn: true,
          winner: null,
        },
      }),
    });

    const data = await res.json();
    setRoomId(data.roomId);
    setGameState(data.gameState);
    setIsHost(true);
  };

  // Join an existing room
  const joinRoom = async (roomId) => {
    const res = await fetch(`${API_URL}/${roomId}`);
    const data = await res.json();

    const updatedState = {
      ...data.gameState,
      player2: name,
    };

    await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState: updatedState }),
    });

    setRoomId(roomId);
    setGameState(updatedState);
    setIsHost(false);
  };

  // Fetch game state every 2 seconds
  const fetchGameState = async () => {
    if (!roomId) return;
    const res = await fetch(`${API_URL}/${roomId}`);
    const data = await res.json();
    setGameState(data.gameState);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchGameState();
    }, 2000);
    return () => clearInterval(interval);
  }, [roomId]);

  const handleClick = async (index) => {
    if (!gameState || gameState.board[index] || gameState.winner) return;

    const isPlayerX = gameState.player1 === name;
    const isPlayerOTurn = !gameState.isXTurn;

    if ((gameState.isXTurn && !isPlayerX) || (!gameState.isXTurn && isPlayerX)) {
      return;
    }

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.isXTurn ? "X" : "O";

    const winner = checkWinner(newBoard);
    const isTie = newBoard.every(cell => cell);

    const updatedState = {
      ...gameState,
      board: newBoard,
      isXTurn: !gameState.isXTurn,
      winner: winner || (isTie ? "Tie" : null),
    };

    await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState: updatedState }),
    });

    setGameState(updatedState);
  };

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const resetRoom = async () => {
    if (!roomId || !gameState) return;

    const clearedState = {
      ...gameState,
      board: Array(9).fill(null),
      isXTurn: true,
      winner: null,
    };

    const res = await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState: clearedState }),
    });

    const data = await res.json();
    setGameState(data.gameState);
  };

  return (
    <div className="rps-container">
      <h1 className="rps-title">Tic Tac Toe</h1>
      <p className="rps-player">{name && `Player: ${name}`}</p>
      {roomId && <p className="rps-room-code">Room Code: {roomId}</p>}

      {/* Display which player is X or O */}
      {gameState?.player1 && <p>{gameState.player1} is X</p>}
      {gameState?.player2 && <p>{gameState.player2} is O</p>}

      {!roomId && (
        <div className="rps-actions">
          <button className="rps-submit" onClick={createRoom}>
            Create Room
          </button>
          <button
            className="rps-submit"
            onClick={() => {
              const id = prompt("Enter Room ID:");
              if (id) joinRoom(id);
            }}
          >
            Join Room
          </button>
        </div>
      )}

      {roomId && (
        <>
          {!gameState?.player2 && (
            <p className="rps-waiting">Waiting for another player to join...</p>
          )}

          <div className="ttt-board">
            {gameState?.board.map((cell, i) => (
              <button
                key={i}
                className={`ttt-cell ${cell === "X" ? "ttt-x" : cell === "O" ? "ttt-o" : ""}`}
                onClick={() => handleClick(i)}
              >
                {cell}
              </button>
            ))}
          </div>

          <div className="rps-result">
            {gameState?.winner
              ? gameState.winner === "Tie"
                ? "It's a tie!"
                : `Winner: ${gameState.winner}`
              : `Turn: ${gameState?.isXTurn ? "X" : "O"}`}
          </div>

          <div className="rps-actions">
            <button onClick={resetRoom} className="rps-reset">
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
}

