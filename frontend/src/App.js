import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Students from './pages/Students';
import Subjects from './pages/Subjects';
import Grades from './pages/Grades';

function App() {
  return (
    <Router>
      <div className="layout">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/students" element={<Students />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/grades" element={<Grades />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;