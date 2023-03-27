import { useState, useEffect, useRef } from "react";

import Cookies from "js-cookie";

const Chat = ({ socket }) => {
  const [messages, setMessages] = useState([
    { username: "rob", message: "hello everyone" },
  ]);
  const messageRef = useRef();

  useEffect(() => {
    socket.emit("join-session", Cookies.get("sessionId"));
  }, []);

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

  const sendMessage = () => {
    socket.emit(
      "chat",
      {
        username: Cookies.get("username"),
        message: messageRef.current.value,
      },
      Cookies.get("sessionId")
    );
    messageRef.current.value = "";
  };

  return (
    <div className="flex flex-col justify-end w-full h-screen">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`${
            message.username == Cookies.get("username")
              ? "chat-end"
              : "chat-start"
          } chat space-y-2 mb-2`}
        >
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
