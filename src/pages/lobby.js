import { useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { faker } from "@faker-js/faker";
import GameState from "../components/gameState";

const getRandomGif = async () => {
  const id = (await (await fetch("https://api.giphy.com/v1/gifs/random?apiKey=7IfGSmZdSFRLfxQaPcLtpQamsqj1ySOa&tag=funny", { method: "GET" })).json()).data.id;

  return `https://media0.giphy.com/media/${id}/giphy.gif`;
};

const Lobby = () => {
  const navigate = useNavigate();
  const { socket, gameCode } = useLoaderData();

  const toastRef = useRef();
  let toastTimeout = null;
  const modalRef = useRef();
  const modalErrorRef = useRef();
  const usernameRef = useRef();
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState({});

  const rejoinSession = () => {
    const player = localStorage.getItem("player");

    if (player) {
      socket.emit("join-session", { sessionId: localStorage.getItem("sessionId"), username: JSON.parse(player).username }, (res) => {
        if (!res.error) {
          setPlayer(res);
          localStorage.setItem("player", JSON.stringify(res));
        }
      });
    }
  };

  const addPlayers = async (ps) => {
    setPlayers(
      await Promise.all(
        ps.map((player) =>
          getRandomGif().then((image) => ({
            ...player,
            image: image,
          }))
        )
      )
    );
  };

  useEffect(() => {
    rejoinSession();

    const gCode = gameCode.split("=")[1];
    localStorage.setItem("sessionId", gCode);

    socket.emit("is-session-id-valid", gCode, (validation) => {
      if (gameCode.split("=")[0] != "gameCode" || validation != true) {
        navigate("/");
      }
    });

    const session = JSON.parse(localStorage.getItem("session"));
    if (session) {
      (async () => {
        await addPlayers(session.players);
      })();
    }
  }, []);

  useEffect(() => {
    setPlayer(() => {
      const p = JSON.parse(localStorage.getItem("player"));
      if (!p || !p.username) {
        showModal();
      } else {
        hideModal();
      }
      return p;
    });
  }, []);

  useEffect(() => {
    socket.on("receive-session", async (res) => {
      await addPlayers(res.players);

      for (const p of res.players) {
        if (p.username == player.username) {
          setPlayer(p);

          localStorage.setItem(
            "player",
            JSON.stringify({
              ...p,
            })
          );
          break;
        }
      }

      localStorage.setItem("session", JSON.stringify(res));

      // if game has started, automatically join game
      if (res.gameState == 1) {
        navigate("/play");
      }
    });
    return () => {
      clearTimeout(toastTimeout);
      return socket.off("receive-session");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("remove-disconnected-player", (p, t, r) => {
      // if player is kicked redirect to index page
      if (JSON.parse(localStorage.player).username == t.username && r == "kicked") {
        navigate("/");
      }

      showToast(t.username + " got disconnected from the lobby");
      let x = JSON.parse(localStorage.getItem("session"));
      x.players = p;
      addPlayers(p);
      localStorage.setItem("session", JSON.stringify(x));
      const playerUpdate = p.findIndex((item) => {
        return item.socketId === socket.id;
      });
      setPlayer(p[playerUpdate]);
      localStorage.setItem("player", JSON.stringify(p[playerUpdate]));
    });
    return () => socket.off("remove-disconnected-player");
  }, [socket]);

  useEffect(() => {
    socket.on("admin-started-game", (session) => {
      localStorage.setItem("session", JSON.stringify(session));
      navigate("/play");
    });
  }, [socket]);

  const showToast = (msg) => {
    if (toastRef) {
      toastRef.current.childNodes[0].innerHTML = msg;
      toastRef.current.style.display = "block";
      toastTimeout = setTimeout(() => (toastRef.current.style.display = "none"), 5000);
    }
  };

  const showModalError = (msg) => {
    modalErrorRef.current.innerHTML = msg;
    modalErrorRef.current.style.display = "block";
    setTimeout(() => (modalErrorRef.current.style.display = "none"), 5000);
  };

  const showModal = () => {
    const className = modalRef.current.className;
    if (!className.includes("modal-open")) {
      modalRef.current.className = `${className} modal-open`;
    }
  };

  const hideModal = () => {
    modalRef.current.className = modalRef.current.className.replace("modal-open", "");
  };

  const setUserName = () => {
    const username = usernameRef.current.value;

    socket.emit("join-session", { sessionId: localStorage.getItem("sessionId"), username: username }, (res) => {
      if (res?.error) {
        showModalError(res.error);
      } else {
        hideModal();
        setPlayer(res);
        localStorage.setItem("player", JSON.stringify(res));
      }
    });
  };

  return (
    <div className="flex flex-col justify-between items-center h-screen">
      <div ref={modalRef} className="modal">
        <div className="flex flex-col modal-box w-full space-y-2">
          <label>Username</label>
          <div className="flex justify-between space-x-3">
            <input
              ref={usernameRef}
              className="input font-bold w-full"
              placeholder="username"
              defaultValue={faker.random.words(2).replace(" ", "")}
              autoFocus
            />
            <button className="btn text-xl" onClick={setUserName}>
              👉
            </button>
          </div>
          <div ref={modalErrorRef} className="text-error text-center"></div>
        </div>
      </div>
      <div>
        <div className="flex flex-col justify-center items-center py-2 mb-4 space-y-1">
          <GameState />
          <h1 className="text-3xl font-bold">{localStorage.getItem("sessionId")}</h1>
          <button
            className="btn text-lg space-x-1"
            onClick={() => {
              navigator.clipboard.writeText(`http://localhost:3000/lobby/gameCode=${localStorage.getItem("sessionId")}`);
              showToast("Copied!");
            }}
          >
            <span></span>
            🔗
            <span>Copy Room Link</span>
          </button>
          <div ref={toastRef} className="hidden toast-top toast-start p-2">
            <div className="alert alert-info"></div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 2xl:grid-cols-12 gap-3">
          {players.length > 0
            ? players.map((p, index) => (
                <div key={index} className="flex flex-col justify-center items-center space-y-1">
                  <div className="w-24 relative">
                    {player.isAdmin && p.username != player.username ? (
                      <div
                        className="tooltip cursor-pointer flex justify-center items-center bg-gray-600 rounded-full w-10 h-10 p-2 text-black font-bold text-xl absolute"
                        data-tip="kick!"
                        onClick={() => {
                          socket.emit("is-admin-kick-player", { sessionId: localStorage.getItem("sessionId"), username: p.username });
                        }}
                      >
                        🦶
                      </div>
                    ) : null}
                    <img className="w-24 aspect-square rounded-full" src={p.image} />
                  </div>
                  <span className="font-bold break-all">{`${p.username} ${p.isAdmin ? "👑" : ""}`}</span>
                </div>
              ))
            : new Array(12).fill().map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="rounded-full bg-slate-700 h-24 w-24"></div>
                </div>
              ))}
        </div>
      </div>

      {player?.isAdmin ? (
        <div className="flex w-full justify-end p-4">
          <button
            className="btn text-xl"
            onClick={() => {
              if (players.length < 3) {
                showToast("Lobby should have at least 3 players");
              } else {
                socket.emit(
                  "is-admin-start-game",
                  {
                    sessionId: localStorage.getItem("sessionId"),
                    username: player.username,
                  },
                  (isAdmin) => {
                    if (isAdmin) {
                      // navigate("/play");
                    } else {
                      showToast("Nice try 😉, you need to be the host to do that");
                    }
                  }
                );
              }
            }}
          >
            Start Game 🎮
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Lobby;
