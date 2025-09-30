import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import HomeHeader from "./components/HomeHeader";
import HomeFooter from "./components/HomeFooter";
import ConsoleHeader from "./components/ConsoleHeader";
import Homepage from "./pages/homepage/homepage";
import Page404 from "./pages/404";
import { Suspense } from "react";
import ANPMOutlet from './pages/anpm'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createHashRouter([
  {
    path: "/",
    element: <>
      <HomeHeader />
      <Suspense>
        <Outlet />
      </Suspense>
      <HomeFooter />
    </>,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "team",
        lazy: () => import("./pages/team/team"),
      },
      {
        path: "mint",
        lazy: () => import("./pages/mint/mint"),
      }
    ],
  },
  {
    path: "console",
    element: (
      <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
        <div
          className="min-h-screen pt-20"
          style={{
            background: "linear-gradient(to bottom, #F3F3F3, #C2C2C2)",
          }}
        >
          <ConsoleHeader />
          <Suspense>
            <Outlet />
          </Suspense>
        </div>
      </ConfigProvider>
    ),
    children: [
      {
        index: true,
        path: "competitions",
        lazy: () => import("./pages/console/pools"),
      },
      {
        path: "competition/:poolid",
        lazy: () => import("./pages/console/competition"),
      },
      {
        path: "playground/:poolid",
        lazy: () => import("./pages/console/playground"),
      },
      {
        path: "perma-brawl",
        lazy: () => import("./pages/console/chatbot"),
      },
    ],
  },
  {
    path: "anpm",
    element: <ANPMOutlet />,
    children: [
      {
        index: true,
        path: "console",
        lazy: () => import("./pages/anpm/console"),
      },
      {
        path: "buy-credit",
        lazy: () => import("./pages/anpm/buy-credit"),
      },
      {
        path: "stake",
        lazy: () => import("./pages/anpm/stake-apus"),
      },
      {
        path: "transfer-credit",
        lazy: () => import("./pages/anpm/transfer-credit"),
      },
      {
        path: "process",
        lazy: () => import("./pages/anpm/process")
      },
      {
        path: "chat",
        lazy: () => import("./pages/anpm/chat"),
      }
    ],
  },
  {
    path: "*",
    element: <Page404 />,
  },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
