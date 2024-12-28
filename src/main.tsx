// import { scan } from "react-scan";

// if (typeof window !== "undefined") {
//   scan({
//     enabled: true,
//     log: false, // logs render info to console (default: false)
//   });
// }

// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./utils/web-vitals";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <App />,
  // </StrictMode>,
);
