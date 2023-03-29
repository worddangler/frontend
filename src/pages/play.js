import { useLoaderData } from "react-router-dom";
import Chat from "../components/chat.js";

const Play = () => {
  const { socket } = useLoaderData();

  return (
    <div>
      <Chat socket={socket} />
    </div>
  );
};

export default Play;
