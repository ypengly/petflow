import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import Overlay from "./pages/Overlay";
import "./styles/index.css";

const overlay = new URLSearchParams(location.search).has("overlay");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {overlay ? <Overlay /> : <HashRouter><App /></HashRouter>}
  </React.StrictMode>
);
