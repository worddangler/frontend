import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { io } from "socket.io-client";

import Index from "./pages/index.js";
import Play from "./pages/play.js";
import Lobby from "./pages/lobby.js";

const socket = io.connect("http://localhost:8000");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    loader: () => ({ socket: socket }),
  },
  {
    path: "/play",
    element: <Play />,
    loader: () => ({ socket: socket }),
  },
  { path: "/lobby", element: <Lobby /> },
]);

const App = () => <RouterProvider router={router} />;

export default App;
