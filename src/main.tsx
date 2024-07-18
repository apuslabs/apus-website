import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeIndex from './pages/HomeIndex'
import NoMatch from './components/404'
import { ConfigProvider, theme } from "antd";

function Main() {
  return (
    <React.StrictMode>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm}}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeIndex />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Main />);
