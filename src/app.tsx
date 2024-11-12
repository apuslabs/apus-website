import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";
import { ArweaveContext, useArweave } from "./contexts/arconnect";
import { ConfigProvider, theme } from "antd";
import { lazy, Suspense } from "react";
import HomeHeader from "./components/HomeHeader";
import HomeFooter from "./components/HomeFooter";
import ConsoleHeader from "./components/ConsoleHeader";
const Homepage = lazy(() => import("./pages/homepage"));
const Team = lazy(() => import("./pages/team"));
const Mint = lazy(() => import("./pages/mint"));
const Competition = lazy(() => import("./pages/console/competition"));
const Playground = lazy(() => import("./pages/console/playground"));
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
            <HomeHeader showLogin={true} />
            <Mint />
            <HomeFooter />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "console",
    element: (
      <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
        <div className="bg-[#D7DDF4] min-h-screen pt-20">
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
  const ar = useArweave();
  return (
    <ConfigProvider>
      <ArweaveContext.Provider value={ar}>
        <RouterProvider router={router} />
      </ArweaveContext.Provider>
    </ConfigProvider>
  );
}
