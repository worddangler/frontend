import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { io } from "socket.io-client";

import Index from "./pages/index.js";
import Play from "./pages/play.js";

const socket = io.connect("http://localhost:8000");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/play",
    element: <Play />,
    loader: () => ({ socket: socket }),
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
