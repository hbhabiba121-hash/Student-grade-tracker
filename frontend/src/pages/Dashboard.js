import React, { useState, useEffect } from 'react';
import { fetchClasses, fetchStudents, fetchSubjects } from '../api';
import StatusBadge from '../components/StatusBadge';

function Dashboard() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchClasses(), fetchStudents(), fetchSubjects()])
      .then(([c, s, sub]) => {
        setClasses(c);
        setStudents(s);
        setSubjects(sub);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const passingStudents = students.filter(s => s.average_score !== null && s.average_score >= 10).length;
  const globalPassRate = students.length > 0 ? Math.round((passingStudents / students.length) * 100) : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of all classes, students and grades</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Classes</div>
          <div className="stat-value purple">{classes.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{students.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Subjects</div>
          <div className="stat-value">{subjects.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Global Pass Rate</div>
          <div className="stat-value green">{globalPassRate}%</div>
        </div>
      </div>

      <div style={{ marginBottom: 10, fontSize: 14, fontWeight: 600 }}>Classes Overview</div>
      <div className="cards-grid" style={{ marginBottom: 28 }}>
        {classes.map(cls => (
          <div className="class-card" key={cls.id}>
            <div className="class-card-name">{cls.name}</div>
            <div className="class-card-session">{cls.session}</div>
            <div className="class-card-meta">
              <span>{cls.student_count} students</span>
              <span>{cls.subject_count} subjects</span>
            </div>
{cls.average_score !== null && cls.average_score !== undefined && (
  <div className="class-card-avg">Avg: {cls.average_score} / 20</div>
)}
{cls.pass_rate !== null && cls.pass_rate !== undefined && (
              <>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>
                  Pass rate: {cls.pass_rate}%
                </div>
                <div className="pass-rate-bar">
                  <div className="pass-rate-fill" style={{ width: `${cls.pass_rate}%` }}></div>
                </div>
              </>
            )}
            {cls.top_student && (
              <div className="top-student">
                Top: <strong>{cls.top_student.name}</strong> ({cls.top_student.average}/20)
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <span className="table-card-title">All Students</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Average</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
  <td>{s.full_name || `${s.first_name} ${s.last_name}`}</td>
  <td>{s.class_name || '—'}</td>
  <td>{s.average_score !== null && s.average_score !== undefined ? `${s.average_score} / 20` : '—'}</td>
  <td><StatusBadge status={s.status || 'No grades'} /></td>
</tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan={4} className="empty-state">No students yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;