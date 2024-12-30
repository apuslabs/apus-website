// import { scan } from "react-scan";

// if (typeof window !== "undefined") {
//   scan({
//     enabled: true,
//     log: false, // logs render info to console (default: false)
//   });
// }
// import * as Sentry from "@sentry/react";
// Sentry.init({
//   dsn: "https://1dfb1a6f352fc56dd7ddea35bc76fdce@o4505799553908736.ingest.us.sentry.io/4508555713839104",
//   integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
//   // Tracing
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
//   // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//   tracePropagationTargets: ["localhost", /^https:\/\/apus\.ar\.io/, /^https:\/\/apus\.network/],
//   // Session Replay
//   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });

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
