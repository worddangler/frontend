import { useState, useEffect, useRef } from "react";
import { faker } from "@faker-js/faker";

const getRandomGif = async () => {
  const id = (
    await (
      await fetch(
        "https://api.giphy.com/v1/gifs/random?apiKey=7IfGSmZdSFRLfxQaPcLtpQamsqj1ySOa&tag=funny",
        { method: "GET" }
      )
    ).json()
  ).data.id;

  return `https://media0.giphy.com/media/${id}/giphy.gif`;
};
const Lobby = () => {
  const toastRef = useRef();
  const modalRef = useRef();
  const usernameRef = useRef();

  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState({});

  useEffect(() => {
    (async () => {
      setPlayers(
        await Promise.all(
          JSON.parse(localStorage.getItem("players")).map((player) =>
            getRandomGif().then((image) => ({
              ...player,
              image: image,
            }))
          )
        )
      );
    })();

    setPlayer(JSON.parse(localStorage.getItem("player")));
  }, []);

  useEffect(() => {
    if (!player.username) {
      showModal();
    } else {
      hideModal();
    }
  }, [player]);

  const showModal = () => {
    modalRef.current.className = `${modalRef.current.className} modal-open`;
  };

  const hideModal = () => {
    modalRef.current.className = modalRef.current.className.replaceAll(
      "modal-open",
      ""
    );
  };

  const setUserName = () => {
    localStorage.setItem(
      "player",
      JSON.stringify({
        ...player,
        username: usernameRef.current.value,
      })
    );
    hideModal();
  };

  return (
    <div className="flex flex-col justify-between items-center h-screen">
      <div ref={modalRef} className="modal">
        <div className="flex justify-between items-center modal-box w-full space-x-3">
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
      </div>
      <div>
        <div className="flex flex-col justify-center items-center py-2 mb-4 space-y-1">
          <h1 className="text-3xl font-bold">
            {localStorage.getItem("sessionId")}
          </h1>
          <button
            className="btn text-lg space-x-1"
            onClick={() => {
              navigator.clipboard.writeText(
                `http://localhost:3000/?gameCode=${localStorage.getItem(
                  "sessionId"
                )}`
              );
              toastRef.current.style.display = "block";
              setTimeout(() => (toastRef.current.style.display = "none"), 5000);
            }}
          >
            <span></span>
            🔗
            <span>copy game link</span>
          </button>
          <div ref={toastRef} className="hidden toast-top toast-start p-2">
            <div className="alert alert-info">
              <div>
                <span>copied!</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 2xl:grid-cols-12 gap-3">
          {players.length > 0
            ? players.map((player, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center items-center space-y-1"
                >
                  <img
                    className="w-24 aspect-square rounded-full"
                    src={player.image}
                  />
                  <span className="font-bold">{`${player.username} ${
                    player.isAdmin ? "👑" : ""
                  }`}</span>
                </div>
              ))
            : new Array(12).fill().map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="rounded-full bg-slate-700 h-24 w-24"></div>
                </div>
              ))}
        </div>
      </div>

      {player.isAdmin ? (
        <div className="flex w-full justify-end p-4">
          <button className="btn text-xl">start game 🎮</button>
        </div>
      ) : null}
    </div>
  );
};

export default Lobby;
