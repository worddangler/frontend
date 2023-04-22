import { useLoaderData } from "react-router-dom";
import Chat from "../components/chat.js";

const Play = () => {
  const { socket } = useLoaderData();

  return (
    <div>
      <h1 className="text-3xl font-bold justify-center text-center">In Game</h1>
      <Chat socket={socket} />
    </div>
  );
};

export default Play;
