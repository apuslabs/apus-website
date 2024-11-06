import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./utils/web-vitals";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
