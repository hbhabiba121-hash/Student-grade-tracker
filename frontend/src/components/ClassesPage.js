import React, { useState } from "react";

function ClassesPage({ classes, setClasses }) {
  const [newClassName, setNewClassName] = useState("");

  const addClass = (e) => {
    e.preventDefault();
    if (newClassName.trim() !== "") {
      const newClass = { 
        id: Date.now(), 
        name: newClassName,
        studentCount: 0 
      };
      setClasses([...classes, newClass]);
      setNewClassName("");
    }
  };

  const deleteClass = (id) => {
    setClasses(classes.filter((c) => c.id !== id));
  };

  return (
    // استعملت "page-content-wrapper" باش ياخد العرض كامل ويبعد على الـ Sidebar
    <div className="page-content-wrapper">
      <h2 className="page-title">Manage Classes (Groupes)</h2>
      
      {/* 1. Form لزيادة قسم جديد */}
      <div className="add-section-card futuristic-card">
        <h3>Add New Class</h3>
        <form onSubmit={addClass} className="input-inline-group" style={{ marginTop: '15px' }}>
          <input 
            type="text" 
            placeholder="e.g. IT Security - Group 1" 
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            className="futuristic-input"
          />
          <button type="submit" className="add-btn">Create Class</button>
        </form>
      </div>

      {/* 2. جدول الأقسام واخد العرض كامل */}
      <div className="list-section-card futuristic-card" style={{ marginTop: '25px', width: '100%' }}>
        <h3>Classes List</h3>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Class Name</th>
                <th>Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, index) => (
                <tr key={cls.id}>
                  <td>#{index + 1}</td>
                  <td>{cls.name}</td>
                  <td style={{ color: '#00d2ff', fontWeight: 'bold' }}>
                    {cls.studentCount || 0} Students
                  </td>
                  <td>
                    <button 
                      onClick={() => deleteClass(cls.id)} 
                      className="delete-btn-icon"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {classes.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#a0aec0' }}>No classes added yet.</p>
        )}
      </div>
    </div>
  );
}

export default ClassesPage;