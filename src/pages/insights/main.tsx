import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./InsightsApp";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
