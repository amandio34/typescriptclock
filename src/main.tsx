// src/main.tsx

import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import App from "./App";

// Get the root container element from the HTML
const container = document.getElementById("root");
if (!container) throw new Error("Root container not found");

// Extend the Window type to optionally hold the React root instance
declare global {
  interface Window { __REACT_ROOT__?: Root; }
}

// Only create the React root once (for hot reloads, etc)
if (!window.__REACT_ROOT__) {
  window.__REACT_ROOT__ = createRoot(container);
}

// Render the main App component inside React.StrictMode
window.__REACT_ROOT__.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
