import { useState, useEffect } from "react";
import { useUser } from "../../UserContext.jsx";
import "./rockpaperscissors.css";

const API_URL = "https://game-room-api.fly.dev/api/rooms";

export default function RockPaperScissors() {
  const choices = ["Rock", "Paper", "Scissors"];
  const { name } = useUser();
  const [roomId, setRoomId] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [playerChoice, setPlayerChoice] = useState("");

  // Create room
  const createRoom = async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        initialState: {
          player1: name,
          player2: null,
          player1Choice: null,
          player2Choice: null,
          scores: { [name]: 0, opponent: 0 },
          result: null,
        },
      }),
    });

    const data = await res.json();
    setRoomId(data.roomId);
    setGameState(data.gameState);
    setIsHost(true);
  };

  // Join room
  const joinRoom = async (roomId) => {
    const res = await fetch(`${API_URL}/${roomId}`);
    const data = await res.json();

    const updatedState = {
      ...data.gameState,
      player2: name,
      scores: {
        ...data.gameState.scores,
        [name]: 0,
      },
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

  // Fetch room state
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

  const handleSubmit = async () => {
    if (!playerChoice || !roomId || !gameState) return;

    const updatedState = { ...gameState };
    const isPlayer1 = gameState.player1 === name;

    if (isPlayer1) {
      updatedState.player1Choice = playerChoice;
    } else {
      updatedState.player2Choice = playerChoice;
    }

    // Check if both choices exist
    if (updatedState.player1Choice && updatedState.player2Choice) {
      const p1 = updatedState.player1Choice;
      const p2 = updatedState.player2Choice;

      let result = "";
      if (p1 === p2) {
        result = "It's a tie!";
      } else if (
        (p1 === "Rock" && p2 === "Scissors") ||
        (p1 === "Paper" && p2 === "Rock") ||
        (p1 === "Scissors" && p2 === "Paper")
      ) {
        result = `${gameState.player1} wins!`;
        updatedState.scores[gameState.player1]++;
      } else {
        result = `${gameState.player2} wins!`;
        updatedState.scores[gameState.player2]++;
      }

      updatedState.result = result;
      updatedState.player1Choice = null;
      updatedState.player2Choice = null;
    }

    const res = await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState: updatedState }),
    });

    const data = await res.json();
    setGameState(data.gameState);
    setPlayerChoice("");
  };

  const resetRoom = async () => {
    if (!roomId || !gameState) return;

    const clearedState = {
      ...gameState,
      player1Choice: null,
      player2Choice: null,
      result: null,
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
      <h1 className="rps-title">Rock Paper Scissors</h1>
      <p className="rps-player">{name && `Player: ${name}`}</p>
      {roomId && <p className="rps-room-code">Room Code: {roomId}</p>}

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
          <p><strong>Room Code:</strong> {roomId}</p>
          <div className="rps-scoreboard">
            {gameState &&
              Object.entries(gameState.scores).map(([player, score]) => (
                <p key={player}>
                  <strong>{player}:</strong> {score}
                </p>
              ))}
          </div>

          <div className="rps-buttons">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => setPlayerChoice(choice)}
                className={`rps-button ${
                  playerChoice === choice ? "selected" : ""
                }`}
              >
                {choice}
              </button>
            ))}
          </div>

          <div className="rps-actions">
            <button onClick={handleSubmit} className="rps-submit">
              Submit
            </button>
            <button onClick={resetRoom} className="rps-reset">
              Reset
            </button>
          </div>

          {gameState?.result && (
            <div className="rps-result">
              <p>{gameState.result}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

