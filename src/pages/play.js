import { useLoaderData } from "react-router-dom";
import Chat from "../components/chat.js";
import GameState from "../components/gameState";

const Play = () => {
  const { socket } = useLoaderData();

  return (
    <div className="flex h-screen flex-col justify-between">
      <GameState />
      <Chat socket={socket} />
    </div>
  );
};

export default Play;
