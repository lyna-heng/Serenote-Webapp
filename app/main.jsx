import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RootWrapper } from "./root";
import "./app.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/Serenote-Webapp">
      <RootWrapper />
    </BrowserRouter>
  </React.StrictMode>
);