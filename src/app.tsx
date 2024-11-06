import { createHashRouter, RouterProvider } from "react-router-dom";
import HomeIndex from "./pages/HomeIndex";
import NoMatch from "./components/404";
import ConsoleWrapper from "./pages/console/wrapper";
import { ArweaveContext, useArweave } from "./contexts/arconnect";
import { ConfigProvider, theme } from "antd";
import { lazy, Suspense } from "react";
const Team = lazy(() => import("./pages/team"));
const Competition = lazy(() => import("./pages/console/competition"));
const Playground = lazy(() => import("./pages/console/playground"));

const router = createHashRouter([
  {
    path: "/",
    element: <HomeIndex />,
  },
  {
    path: "team",
    element: (
      <Suspense>
        <Team />
      </Suspense>
    ),
  },
  {
    path: "console",
    element: (
      <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
        <ConsoleWrapper />
      </ConfigProvider>
    ),
    children: [
      {
        path: "competition/:poolid",
        element: (
          <Suspense>
            <Competition />
          </Suspense>
        ),
      },
      {
        path: "playground/:poolid",
        element: (
          <Suspense>
            <Playground />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NoMatch />,
  },
]);

export default function App() {
  const ar = useArweave();
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <ArweaveContext.Provider value={ar}>
        <RouterProvider router={router} />
      </ArweaveContext.Provider>
    </ConfigProvider>
  );
}
