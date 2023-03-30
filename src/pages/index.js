import { useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import "../App.css";
import AnimatedTitle from "../components/animatedTitle";

const Index = () => {
  const { socket } = useLoaderData();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [button, setButton] = useState("");
  const inputRef = useRef();

  return (
    <div className="flex flex-col justify-center items-center content-center">
      <AnimatedTitle />
      <div className="flex flex-col sm:flex-row items-center justify-center mt-10 sm:mt-32">
        <button
          className="btn m-2"
          onClick={() => {
            localStorage.clear();
            socket.emit("create-new-session", (sessionid) => {
              localStorage.setItem("sessionId", sessionid);
            });
            navigate("/lobby");
          }}
        >
          Create New Lobby
        </button>
        <button
          className="btn m-2"
          onClick={() => {
            setButton("id");
            setText("");
            if (inputRef.current != undefined) {
              inputRef.current.value = "";
            }
          }}
        >
          Enter Session ID
        </button>
        <button
          className="btn m-2"
          onClick={() => {
            setButton("link");
            setText("");
            if (inputRef.current != undefined) {
              inputRef.current.value = "";
            }
          }}
        >
          Enter Invite Link
        </button>
      </div>
      {button != "" ? (
        <input
          ref={inputRef}
          type="text"
          style={{ color: "black" }}
          autoCorrect="off"
          autoCapitalize="off"
          autoFocus="on"
          autoComplete="off"
          name="text"
          maxLength={button == "id" ? 6 : null}
          className="input mt-3 mx-5 sm:ml-8"
          placeholder={button == "id" ? "6 digit Session ID" : "Invite Link"}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyPress={(key) => {
            if (key.code == "Enter") {
              if (button == "id" && text.length == 6) {
                localStorage.clear();
                //Event to check if id is valid
                socket.emit("is-session-id-valid", text);
                localStorage.setItem("sessionId", text);
                navigate("/lobby");
              } else if (button == "link" && text.length != 0) {
                //Event to check if id is valid
                socket.emit("is-session-id-valid", text);
                localStorage.setItem("sessionId", text);
                navigate("/lobby");
              } else {
                if (button == "id") alert("Invalid ID. Enter session ID again");
                else if (button == "link")
                  alert("Invalid Link. Enter the link again");
              }
            }
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Index;
