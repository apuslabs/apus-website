import { createHashRouter, RouterProvider } from "react-router-dom";
import HomeIndex from "./pages/HomeIndex";
import NoMatch from "./components/404";
import ConsoleWrapper from "./pages/console/wrapper";
import Competition from "./pages/console/competition";
import { ArweaveContext, useArweave } from "./contexts/arconnect";
import { ConfigProvider, theme } from "antd";
import Playground from "./pages/console/playground";
import Team from "./pages/team";

const router = createHashRouter([
  {
    path: "/",
    element: <HomeIndex />,
  },
  {
    path: "team",
    element: <Team />,
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
        element: <Competition />,
      },
      {
        path: "playground/:poolid",
        element: <Playground />,
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
