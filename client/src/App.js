import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Header } from "./components/Header/Header";
import { AdminPanel } from "./pages/AdminPanel/AdminPanel";
import { UserPage } from "./pages/UserPage/UserPage";
import "./App.scss";

function App() {
  return (
    <div className="app">
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
