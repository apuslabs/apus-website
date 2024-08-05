import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeIndex from "./pages/HomeIndex";
import NoMatch from "./components/404";
import ConsoleWrapper from "./pages/console/wrapper";
import Competition from "./pages/console/competition";
import { ArweaveContext, useArweave } from "./contexts/arconnect";
import { ConfigProvider, theme } from "antd";
import Playground from "./pages/console/playground";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeIndex />,
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
        path: "competition",
        element: <Competition />,
      },
      {
        path: "playground",
        element: <Playground />
      }
    ],
  },
  {
    path: "*",
    element: <NoMatch />,
  },
]);

export default function App() {
  const ar = useArweave();
  return <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
    <ArweaveContext.Provider value={ar}>
      <RouterProvider router={router} />
    </ArweaveContext.Provider>
  </ConfigProvider>;
}
