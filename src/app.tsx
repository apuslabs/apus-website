import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { lazy, Suspense } from "react";
import HomeHeader from "./components/HomeHeader";
import HomeFooter from "./components/HomeFooter";
import ConsoleHeader from "./components/ConsoleHeader";
import Homepage from "./pages/homepage/homepage";
// const Homepage = lazy(() => import("./pages/homepage/homepage"));
const Team = lazy(() => import("./pages/team/team"));
const Mint = lazy(() => import("./pages/mint/mint"));
const Competition = lazy(() => import("./pages/console/competition"));
const Playground = lazy(() => import("./pages/console/playground"));
const Chatbot = lazy(() => import("./pages/console/chatbot"));
const Page404 = lazy(() => import("./pages/404"));
const Pools = lazy(() => import("./pages/console/pools"));

const router = createHashRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        path: "/",
        element: (
          <Suspense>
            <HomeHeader />
            <Homepage />
            <HomeFooter />
          </Suspense>
        ),
      },
      {
        path: "team",
        element: (
          <Suspense>
            <HomeHeader />
            <Team />
            <HomeFooter />
          </Suspense>
        ),
      },
      {
        path: "mint",
        element: (
          <Suspense>
            <Mint />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "console",
    element: (
      <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
        <div className="min-h-screen pt-20" style={{
          background: "linear-gradient(to bottom, #F3F3F3, #C2C2C2)"
        }}>
          <ConsoleHeader />
          <Outlet />
        </div>
      </ConfigProvider>
    ),
    children: [
      {
        path: "competitions",
        element: (
          <Suspense>
            <Pools />
          </Suspense>
        ),
      },
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
      {
        path: "perma-brawl",
        element: (
          <Suspense>
            <Chatbot />
          </Suspense>
        )
      }
    ],
  },
  {
    path: "*",
    element: (
      <Suspense>
        <div className="min-h-screen flex flex-col">
          <HomeHeader />
          <Page404 />
          <HomeFooter />
        </div>
      </Suspense>
    ),
  },
]);

export default function App() {
  return (
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
