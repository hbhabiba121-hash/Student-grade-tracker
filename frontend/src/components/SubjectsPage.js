import React, { useState } from "react";

function SubjectsPage({ subjects, setSubjects }) {
  const [subName, setSubName] = useState("");

  const addSubject = (e) => {
    e.preventDefault();
    if (!subName) return;

    const newSubject = {
      id: Date.now(),
      name: subName
      // حيدنا الـ coeff هنا
    };

    setSubjects([...subjects, newSubject]);
    setSubName("");
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  return (
    <div className="subjects-page-wrapper">
      <h2 className="page-title">Manage Subjects (Modules)</h2>
      
      <div className="subjects-card-container">
        <h3>Add New Module</h3>
        <form onSubmit={addSubject} className="subject-form-modern">
          <div className="input-group">
            <label>Module Name</label>
            <input 
              type="text" 
              placeholder="e.g. Linux, Math, Java..." 
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
            />
          </div>
          
          {/* حيدنا الـ input-group ديال الـ Coefficient من هنا */}
          
          <button type="submit" className="calculate-btn">Add Module</button>
        </form>
      </div>

      <div className="table-section-modern">
        <h3>Modules List</h3>
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Module Name</th>
              {/* حيدنا الـ th ديال الـ Coefficient */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s, index) => (
              <tr key={s.id}>
                {/* استعملت index+1 باش يبان الترتيب ساهل */}
                <td>#{index + 1}</td>
                <td>{s.name}</td>
                {/* حيدنا الـ td ديال الـ Coefficient */}
                <td>
                  <button onClick={() => deleteSubject(s.id)} className="delete-btn-icon">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubjectsPage;