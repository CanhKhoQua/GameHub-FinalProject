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
          scores: { [name]: 0 },
          result: null,
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

  const joinRoom = async (roomId) => {
    const res = await fetch(`${API_URL}/${roomId}`);
    const data = await res.json();

    const updatedState = {
      ...data.gameState,
      player2: name,
      scores: {
        ...data.gameState.scores,
        [name]: data.gameState.scores[name] || 0,
      },
      player2Reset: false,
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

    if (updatedState.player1Choice && updatedState.player2Choice) {
      const p1 = updatedState.player1Choice;
      const p2 = updatedState.player2Choice;

      let result = `${gameState.player1} picked ${p1}, ${gameState.player2} picked ${p2}. `;
      if (p1 === p2) {
        result += "It's a tie!";
      } else if (
        (p1 === "Rock" && p2 === "Scissors") ||
        (p1 === "Paper" && p2 === "Rock") ||
        (p1 === "Scissors" && p2 === "Paper")
      ) {
        result += `${gameState.player1} wins!`;
        updatedState.scores[gameState.player1]++;
      } else {
        result += `${gameState.player2} wins!`;
        updatedState.scores[gameState.player2]++;
      }

      updatedState.result = result;
      updatedState.player1Choice = null;
      updatedState.player2Choice = null;
      updatedState.player1Reset = false;
      updatedState.player2Reset = false;
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

    const isPlayer1 = gameState.player1 === name;
    const updatedState = {
      ...gameState,
      player1Reset: isPlayer1 ? true : gameState.player1Reset,
      player2Reset: !isPlayer1 ? true : gameState.player2Reset,
    };

    const bothConfirmed = updatedState.player1Reset && updatedState.player2Reset;

    if (bothConfirmed) {
      updatedState.player1Choice = null;
      updatedState.player2Choice = null;
      updatedState.result = null;
      updatedState.player1Reset = false;
      updatedState.player2Reset = false;
    }

    const res = await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState: updatedState }),
    });

    const data = await res.json();
    setGameState(data.gameState);
  };

  const getOpponentChoiceText = () => {
    if (!gameState) return "";

    const isPlayer1 = gameState.player1 === name;
    const opponent = isPlayer1 ? gameState.player2 : gameState.player1;
    const opponentChoice = isPlayer1
      ? gameState.player2Choice
      : gameState.player1Choice;

    return opponentChoice ? `${opponent} picked ${opponentChoice}` : "";
  };

  const getPlayerChoiceText = () => {
    if (!gameState) return "";

    const isPlayer1 = gameState.player1 === name;
    const myChoice = isPlayer1
      ? gameState.player1Choice
      : gameState.player2Choice;

    return myChoice ? `You picked ${myChoice}` : "";
  };

  const opponentRequestedReset = () => {
    if (!gameState) return false;
    const isPlayer1 = gameState.player1 === name;
    return isPlayer1 ? gameState.player2Reset : gameState.player1Reset;
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
          {!gameState?.player2 && (
            <p className="rps-waiting">Waiting for another player to join...</p>
          )}

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
              Request Reset
            </button>
          </div>

          <div className="rps-picks">
            <p>{getPlayerChoiceText()}</p>
            <p>{getOpponentChoiceText()}</p>
          </div>

          {opponentRequestedReset() && (
            <p className="rps-waiting">Opponent requested a reset</p>
          )}

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
