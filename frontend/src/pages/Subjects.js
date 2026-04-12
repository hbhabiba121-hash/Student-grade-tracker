import React, { useState, useEffect } from 'react';
import { fetchStudents, createStudent, updateStudent, deleteStudent, fetchClasses } from '../api';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', school_class: '' });
  const [error, setError] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const loadData = async () => {
    const [s, c] = await Promise.all([fetchStudents(), fetchClasses()]);
    setStudents(s);
    setClasses(c);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({ first_name: '', last_name: '', school_class: '' });
    setError('');
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditItem(s);
    setForm({ first_name: s.first_name, last_name: s.last_name, school_class: s.school_class });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name) { setError('First and last name are required'); return; }
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        school_class: form.school_class || null,
      };
      if (editItem) {
        await updateStudent(editItem.id, payload);
      } else {
        await createStudent(payload);
      }
      setShowModal(false);
      loadData();
    } catch (e) {
      setError('Something went wrong. Try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    await deleteStudent(id);
    loadData();
  };

  const filtered = filterClass
    ? students.filter(s => String(s.school_class) === String(filterClass))
    : students;

  if (loading) return <div className="loading">Loading students...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{students.length} students total</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Student</button>
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
        <div className="table-card-header">
          <span className="table-card-title">
            {filterClass ? `Students in ${classes.find(c => String(c.id) === String(filterClass))?.name}` : 'All Students'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{filtered.length} results</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Average</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td><strong>{s.full_name}</strong></td>
                <td>{s.class_name || '—'}</td>
                <td>{s.average_score !== null ? `${s.average_score} / 20` : '—'}</td>
                <td><StatusBadge status={s.status} /></td>
                <td>
                  <div className="action-btns">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="empty-state">No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editItem ? 'Edit Student' : 'New Student'} onClose={() => setShowModal(false)}>
          {error && <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 12 }}>{error}</p>}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} placeholder="First name" />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} placeholder="Last name" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Class</label>
            <select value={form.school_class} onChange={e => setForm({ ...form, school_class: e.target.value })}>
              <option value="">No class assigned</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.session}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editItem ? 'Save Changes' : 'Create Student'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Students;