import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from "antd";
import HomeIndex from './pages/HomeIndex'
import NoMatch from './components/404'
import ConsoleWrapper from './pages/console/wrapper'
import Competition from './pages/console/competition'
import { ArweaveContext, useArweave } from "./contexts/arconnect";

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeIndex />
  },
  {
    path: 'console',
    element: <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}><ConsoleWrapper /></ConfigProvider>,
    children: [
      {
        path: 'competition',
        element: <Competition />
      }
    ]
  },
  {
    path: '*',
    element: <NoMatch />
  }
])

function App() {
  const ar= useArweave()
  return <ArweaveContext.Provider value={ar} >
    <RouterProvider router={router} />
  </ArweaveContext.Provider>
}

function Main() {
  return (
    <React.StrictMode>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm}}>
        <App />
      </ConfigProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Main />);
