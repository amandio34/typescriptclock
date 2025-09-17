// src/main.tsx
import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";

import App from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("Root container not found");

declare global {
  interface Window { __REACT_ROOT__?: Root; }
}

if (!window.__REACT_ROOT__) {
  window.__REACT_ROOT__ = createRoot(container);
}

window.__REACT_ROOT__.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
