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
      <AnimatedTitle title="WordDangler" className="text-5xl sm:text-7xl lg:text-9xl mt-10 text-black" />
      <div className="flex flex-col sm:flex-row items-center justify-center mt-10 sm:mt-32">
        <button
          className="btn m-2"
          onClick={() => {
            localStorage.clear();
            socket.emit("create-new-session", (sessionid) => {
              navigate("/lobby/gameCode=" + sessionid);
            });
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
      </div>
      {button != "" ? (
        <>
          <input
            ref={inputRef}
            type="text"
            style={{ color: "black" }}
            autoCorrect="off"
            autoCapitalize="off"
            autoFocus="on"
            autoComplete="off"
            name="text"
            maxLength={6}
            className="input mt-3 mx-5 sm:ml-8"
            placeholder="6 digit Session ID"
            onChange={(e) => {
              setText(e.target.value);
            }}
            onKeyPress={(key) => {
              if (key.code == "Enter") {
                localStorage.clear();
                //Event to check if id is valid
                socket.emit("is-session-id-valid", text, (validation) => {
                  if (validation == true) {
                    navigate("/lobby/gameCode=" + text);
                  } else {
                    alert("Session ID not exist");
                  }
                });
              }
            }}
          />
          <button
            className="btn m-2"
            onClick={() => {
              localStorage.clear();
              //Event to check if id is valid
              socket.emit("is-session-id-valid", text, (validation) => {
                if (validation == true) {
                  navigate("/lobby/gameCode=" + text);
                } else {
                  alert("Session ID not exist");
                }
              });
            }}
          >
            Enter
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Index;
