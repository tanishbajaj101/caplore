import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import JoinApp from "./JoinApp";
import "./join.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <JoinApp />
  </StrictMode>,
);
