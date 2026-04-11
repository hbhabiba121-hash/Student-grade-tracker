import React, { useState, useEffect } from 'react';
import { fetchGrades, createGrade, updateGrade, deleteGrade, fetchClasses, fetchFilterOptions } from '../api';
import Modal from '../components/Modal';

function Grades() {
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ school_class: '', student: '', subject: '', score: '' });
  const [filterOptions, setFilterOptions] = useState({ students: [], subjects: [] });
  const [error, setError] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const loadData = async () => {
    const [g, c] = await Promise.all([fetchGrades(), fetchClasses()]);
    setGrades(g);
    setClasses(c);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleClassChange = async (classId) => {
    setForm(f => ({ ...f, school_class: classId, student: '', subject: '' }));
    if (classId) {
      const options = await fetchFilterOptions(classId);
      setFilterOptions(options);
    } else {
      setFilterOptions({ students: [], subjects: [] });
    }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ school_class: '', student: '', subject: '', score: '' });
    setFilterOptions({ students: [], subjects: [] });
    setError('');
    setShowModal(true);
  };

  const openEdit = async (g) => {
    setEditItem(g);
    setForm({
      school_class: g.school_class,
      student: g.student,
      subject: g.subject,
      score: g.score,
    });
    if (g.school_class) {
      const options = await fetchFilterOptions(g.school_class);
      setFilterOptions(options);
    }
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.school_class || !form.student || !form.subject || !form.score) {
      setError('All fields are required');
      return;
    }
    const score = parseFloat(form.score);
    if (isNaN(score) || score < 0 || score > 20) {
      setError('Score must be between 0 and 20');
      return;
    }
    try {
      const payload = {
        school_class: parseInt(form.school_class),
        student: parseInt(form.student),
        subject: parseInt(form.subject),
        score: score,
      };
      if (editItem) {
        await updateGrade(editItem.id, payload);
      } else {
        await createGrade(payload);
      }
      setShowModal(false);
      loadData();
    } catch (e) {
      setError('Something went wrong. Check that this grade does not already exist.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this grade?')) return;
    await deleteGrade(id);
    loadData();
  };

  const filtered = filterClass
    ? grades.filter(g => String(g.school_class) === String(filterClass))
    : grades;

  if (loading) return <div className="loading">Loading grades...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Grades</h1>
          <p className="page-subtitle">{grades.length} grades total</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Assign Grade</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <select
          style={{ width: 220 }}
          value={filterClass}
          onChange={e => setFilterClass(e.target.value)}
        >
          <option value="">All classes</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Score</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(g => (
              <tr key={g.id}>
                <td><strong>{g.student_detail?.full_name || '—'}</strong></td>
                <td>{g.subject_detail?.name || '—'}</td>
                <td>
                  <span style={{
                    fontFamily: 'DM Mono, monospace',
                    fontWeight: 500,
                    color: parseFloat(g.score) >= 10 ? 'var(--green)' : 'var(--red)'
                  }}>
                    {g.score} / 20
                  </span>
                </td>
                <td style={{ color: 'var(--gray-400)', fontSize: 12 }}>
                  {new Date(g.created_at).toLocaleDateString()}
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(g)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(g.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="empty-state">No grades found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editItem ? 'Edit Grade' : 'Assign Grade'} onClose={() => setShowModal(false)}>
          {error && <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 12 }}>{error}</p>}
          <div className="form-group">
            <label className="form-label">Class</label>
            <select
              value={form.school_class}
              onChange={e => handleClassChange(e.target.value)}
            >
              <option value="">Select a class first</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.session}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Student</label>
            <select
              value={form.student}
              onChange={e => setForm({ ...form, student: e.target.value })}
              disabled={!form.school_class}
            >
              <option value="">Select a student</option>
              {filterOptions.students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              disabled={!form.school_class}
            >
              <option value="">Select a subject</option>
              {filterOptions.subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Score (0 — 20)</label>
            <input
              type="number"
              min="0"
              max="20"
              step="0.25"
              value={form.score}
              onChange={e => setForm({ ...form, score: e.target.value })}
              placeholder="e.g. 15.5"
            />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editItem ? 'Save Changes' : 'Assign Grade'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Grades;