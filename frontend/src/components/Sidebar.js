import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">GRADE<span>X</span></div>

      <div className="nav-section-label">Manage</div>
      <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-dot dot-purple"></span> Dashboard
      </NavLink>
      <NavLink to="/classes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-dot dot-purple"></span> Classes
      </NavLink>
      <NavLink to="/students" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-dot dot-teal"></span> Students
      </NavLink>
      <NavLink to="/subjects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-dot dot-amber"></span> Subjects
      </NavLink>
      <NavLink to="/grades" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-dot dot-blue"></span> Grades
      </NavLink>
    </aside>
  );
}

export default Sidebar;