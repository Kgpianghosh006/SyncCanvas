import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import Toolbox from "./components/Toolbox";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import BoardProvider from "./store/BoardProvider";
import ToolboxProvider from "./store/ToolboxProvider";
import { ThemeProvider } from "./store/ThemeProvider";
import { useParams } from "react-router-dom";


function HomePage() {
  const { id } = useParams();
  return (
    <ToolboxProvider>
      <div className="app-container">
        <Toolbar />
        <Board id={id}/>
        <Toolbox />
        <Sidebar />
      </div>
    </ToolboxProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BoardProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/board" element={<HomePage />} />
            <Route path="/board/:id" element={<HomePage />} />
          </Routes>
        </Router>
      </BoardProvider>
    </ThemeProvider>
  );
}

export default App;
