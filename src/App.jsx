import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Seats from "./pages/Seats";
import Books from "./pages/Books";
import Borrow from "./pages/Borrow";

export default function App() {
  return (
    <BrowserRouter>
      <div className="site-root">
        <Navbar />
        <main className="page">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/seats" element={<Seats />} />
            <Route path="/books" element={<Books />} />
            <Route path="/borrow" element={<Borrow />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}