import React from "react";
import ReactDOM from "react-dom/client";
import FirstInvitation from "./FirstInvitation.jsx";
import { spisak } from "./spisak.js";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { spisak2 } from "./spisak2.js";
import SecondInvitation from "./SecondInvitation.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FirstInvitation />} />
        {Object.values(spisak).map((obj, index) => {
          return <Route element={<FirstInvitation />} key={obj.path + index} path={obj.path} />;
        })}
        {Object.values(spisak2).map((obj, index) => {
          return <Route element={<SecondInvitation />} key={obj.path + index} path={obj.path} />;
        })}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
