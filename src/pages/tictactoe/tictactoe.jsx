import { useEffect, useState } from "react";
import { useUser } from "../../UserContext.jsx";
import "./ttt.css";

const API_URL = "https://game-room-api.fly.dev/api/rooms";

export default function TicTacToe() {
  const { name } = useUser();
  const [roomId, setRoomId] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [gameState, setGameState] = useState(null);

  // Create a new room and initialize game state
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
          player1Reset: false,
          player2Reset: false,
        },
      }),
    });

    const data = await res.json();
    setRoomId(data.roomId);
    setGameState(data.gameState);
    setIsHost(true);
  };

  // Join an existing room and set current user as player2
  const joinRoom = async (roomId) => {
    const res = await fetch(`${API_URL}/${roomId}`);
    const data = await res.json();

    const updatedState = {
      ...data.gameState,
      player2: name,
      player2Reset: false,
    };

    // Update game state on the server with player2 info
    await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState: updatedState }),
    });

    setRoomId(roomId);
    setGameState(updatedState);
    setIsHost(false);
  };

  // Repeatedly fetch latest game state every 2 seconds
  const fetchGameState = async () => {
    if (!roomId) return;
    const res = await fetch(`${API_URL}/${roomId}`);
    const data = await res.json();
    setGameState(data.gameState);
  };

  // Start polling the server after joining/creating a room
  useEffect(() => {
    const interval = setInterval(() => {
      fetchGameState();
    }, 2000);
    return () => clearInterval(interval);
  }, [roomId]);

  // Handle move when a cell is clicked
  const handleClick = async (index) => {
    if (!gameState || gameState.board[index] || gameState.winner) return;

    const isPlayerX = gameState.player1 === name;

    // Prevent invalid turn
    if ((gameState.isXTurn && !isPlayerX) || (!gameState.isXTurn && isPlayerX)) {
      return;
    }

    // Update board
    const newBoard = [...gameState.board];
    newBoard[index] = gameState.isXTurn ? "X" : "O";

    const winner = checkWinner(newBoard);
    const isTie = newBoard.every(cell => cell);

    // Build updated game state
    const updatedState = {
      ...gameState,
      board: newBoard,
      isXTurn: !gameState.isXTurn,
      winner: winner || (isTie ? "Tie" : null),
      player1Reset: false,
      player2Reset: false,
    };

    // Send updated state to server
    await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState: updatedState }),
    });

    setGameState(updatedState);
  };

  // Check for winner on the board
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

  // Request a game reset
  const resetRoom = async () => {
    if (!roomId || !gameState) return;

    const isPlayer1 = gameState.player1 === name;

    // Mark reset request for current player
    const updatedState = {
      ...gameState,
      player1Reset: isPlayer1 ? true : gameState.player1Reset,
      player2Reset: !isPlayer1 ? true : gameState.player2Reset,
    };

    // If both players requested reset, clear board and reset state
    const bothConfirmed = updatedState.player1Reset && updatedState.player2Reset;

    if (bothConfirmed) {
      updatedState.board = Array(9).fill(null);
      updatedState.isXTurn = true;
      updatedState.winner = null;
      updatedState.player1Reset = false;
      updatedState.player2Reset = false;
    }

    // Send updated game state to server
    const res = await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState: updatedState }),
    });

    const data = await res.json();
    setGameState(data.gameState);
  };

  // Get current player's symbol (X or O)
  const getSymbol = (playerName) => {
    if (gameState?.player1 === playerName) return "X";
    if (gameState?.player2 === playerName) return "O";
    return "";
  };

  // Get other player's name
  const otherPlayer = () =>
    gameState?.player1 === name ? gameState?.player2 : gameState?.player1;

  return (
    <div className="rps-container">
      <h1 className="rps-title">Tic Tac Toe</h1>
      <p className="rps-player">{name && `Player: ${name} is ${getSymbol(name)}`}</p>
      {otherPlayer() && (
        <p className="rps-player">{otherPlayer()} is {getSymbol(otherPlayer())}</p>
      )}
      {roomId && <p className="rps-room-code">Room Code: {roomId}</p>}

      {/* Room creation/joining */}
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

      {/* Game board */}
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

          {/* Display result or next turn */}
          <div className="rps-result">
            {gameState?.winner
              ? gameState.winner === "Tie"
                ? "It's a tie!"
                : `Winner: ${gameState.winner}`
              : `Turn: ${gameState?.isXTurn ? "X" : "O"}`}
          </div>

          {/* Reset button and opponent request message */}
          <div className="rps-actions">
            <button onClick={resetRoom} className="rps-reset">
              Request Reset
            </button>
            {((gameState?.player1 === name && gameState?.player2Reset) ||
              (gameState?.player2 === name && gameState?.player1Reset)) && (
              <p className="rps-waiting">Opponent requested a reset</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

