import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import { Login } from "./pages/login";

export default function AppRoutes() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');
  const userName = localStorage.getItem('nome');
  const tipo = localStorage.getItem('tipo');

  if (token && userId && userName && tipo) {
    
  }

  return (
    <BrowserRouter>
      <div className="wrapper">
        <main className="mainContainer">
          <Routes >
            <Route path="/" element={<Login/>} />
            <Route path="/login" element={<Login/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );

}
