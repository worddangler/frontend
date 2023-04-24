import { useState, useEffect, useRef } from "react";

const Chat = ({ socket }) => {
  const [messages, setMessages] = useState([{ username: "roombot", message: "welcome to chat!" }]);
  const messageRef = useRef();

  useEffect(() => {
    socket.on("receive-chat", (data) => {
      setMessages((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
        },
      ]);
    });
    return () => socket.off("receive-chat");
  }, [socket]);

  useEffect(() => {
    socket.on("remove-disconnected-player", (players, player) => {
      setMessages((state) => [...state, { username: "roombot", message: `${player.username} left` }]);
      let x = JSON.parse(localStorage.getItem("session"));
      x.players = players;
      localStorage.setItem("session", JSON.stringify(x));
      const playerUpdate = players.findIndex((item) => {
        return item.socketId === socket.id;
      });
      localStorage.setItem("player", JSON.stringify(players[playerUpdate]));
    });
    return () => socket.off("remove-disconnected-player");
  }, [socket]);

  const sendMessage = () => {
    socket.emit(
      "chat",
      {
        username: JSON.parse(localStorage.player).username,
        message: messageRef.current.value,
      },
      localStorage.sessionId
    );
    messageRef.current.value = "";
  };

  return (
    <div className="flex flex-col justify-end">
      {messages.map((message, index) => (
        <div key={index} className={`${message.username == JSON.parse(localStorage.player).username ? "chat-start" : "chat-end"} chat space-y-2 mb-2`}>
          <div className="chat-bubble break-words">
            <h3 className="font-bold">{message.username}</h3>
            {message.message}
          </div>
        </div>
      ))}
      <div className="flex justify-end space-x-3">
        <textarea
          ref={messageRef}
          className="w-full textarea"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
        ></textarea>
        <button className="btn" onClick={sendMessage}>
          send
        </button>
      </div>
    </div>
  );
};

export default Chat;
