import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import HomeHeader from "./components/HomeHeader";
import HomeFooter from "./components/HomeFooter";
import ConsoleHeader from "./components/ConsoleHeader";
import Homepage from "./pages/homepage/homepage";
import Page404 from "./pages/404";
import { Suspense } from "react";

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
      },
      {
        path: "stake",
        lazy: async () => {
          const module = await import("./pages/stake/stake");
          return { Component: module.default };
        },
      },
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
    path: "*",
    element: <Page404 />,
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
