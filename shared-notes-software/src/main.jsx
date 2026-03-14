import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
// main.jsx or App.jsx — add at the top
import { WritableStream } from "streamsaver";
import mitm from "streamsaver/mitm.html?url"; // vite syntax

// Set the mitm path so streamsaver can intercept the download
import streamsaver from "streamsaver";
streamsaver.mitm = mitm;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster position="bottom-right" />
    <App />
  </StrictMode>,
);
