import React from "react";
import { AdminPanel } from "./components/AdminPanel/AdminPanel";
import { UserPage } from "./components/UserPage/UserPage";
import { Header } from "./components/Header/Header";
import ThemeProvider from "./providers/ThemeProvider";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import "./App.scss";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div style={{ position: "relative" }} className="App">
      <ErrorBoundary>
        <ThemeProvider>
          <Header />
          <BrowserRouter>
            <Routes>
              <Route path="admin" element={<AdminPanel />} />
              <Route path="page/:href" element={<UserPage />} />
              <Route path="*" element={<h1>Страница не найдена</h1>} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
