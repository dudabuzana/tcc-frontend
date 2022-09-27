import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Home } from "./pages/home";
import { CadastrarUsuario } from "./pages/usuario/cadastrar";
import { ListarProfessor } from "./pages/professor/listar";
import { CadastrarProfessor } from "./pages/professor/cadastrar";
import { ListarAluno } from "./pages/aluno/listar";
import { CadastrarAluno } from "./pages/aluno/cadastrar";
import { ListarDisciplina } from "./pages/disciplina/listar";
import { CadastrarDisciplina } from "./pages/disciplina/cadastrar";
import { ListarTurma } from "./pages/turma/listar";

export default function AppRoutes() {
  const token = localStorage.getItem('token');
  const cpfCnpj = localStorage.getItem('cpfCnpj');
  const nivel = localStorage.getItem('nivel');

  if (token && cpfCnpj && nivel) {
    return (
      <BrowserRouter>
        <div className="wrapper">
          <main className="mainContainer">
            <Routes >
              <Route path="/home" element={<Home/>} />
              <Route path="/professor/list" element={<ListarProfessor/>} />
              <Route path="/professor/cadastrar" element={<CadastrarProfessor/>} />
              <Route path="/aluno/list" element={<ListarAluno/>} />
              <Route path="/aluno/cadastrar" element={<CadastrarAluno/>} />
              <Route path="/aluno/alterar/:cpfCnpj" element={<CadastrarAluno/>} />
              <Route path="/disciplina/list" element={<ListarDisciplina/>} />
              <Route path="/disciplina/cadastrar" element={<CadastrarDisciplina/>} />
              <Route path="/turma/list" element={<ListarTurma/>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="wrapper">
        <main className="mainContainer">
          <Routes >
            <Route path="/" element={<Login/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/usuario/cadastrar" element={<CadastrarUsuario/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );

}
