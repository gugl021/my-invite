import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { spisak } from "./spisak.js";
import { Route, BrowserRouter, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {Object.values(spisak).map((obj, index) => {
          return <Route element={<App />} key={obj.path + index} path={obj.path} />;
        })}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
