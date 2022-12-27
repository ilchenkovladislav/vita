import React from "react";
import { AdminPanel } from "./components/AdminPanel/AdminPanel";
import { UserPage } from "./components/UserPage/UserPage";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div style={{ position: "relative" }} className="App">
      <BrowserRouter>
        <Routes>
          <Route path="admin" element={<AdminPanel />} />
          <Route path="page/:href" element={<UserPage />} />
          <Route path="*" element={<h1>Страница не найдена</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
