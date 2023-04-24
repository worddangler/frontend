import { useEffect, useState } from "react";

const GameState = () => {
  const gameStates = { 0: "Waiting for game to start", 1: "Game is currently being played" };
  const [gameState, setGameState] = useState();
  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      setGameState(JSON.parse(session).gameState);
    }
  }, [localStorage.getItem("session")]);

  return (
    <div className="flex justify-center">
      <h1 className="text-3xl font-bold">{gameStates[gameState]}</h1>
    </div>
  );
};

export default GameState;
