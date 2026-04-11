import React, { useState, useEffect } from 'react';
import { fetchClasses, createClass, updateClass, deleteClass, fetchSubjects } from '../api';
import Modal from '../components/Modal';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', session: '', subjects: [] });
  const [error, setError] = useState('');

  const loadData = async () => {
    const [c, s] = await Promise.all([fetchClasses(), fetchSubjects()]);
    setClasses(c);
    setSubjects(s);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', session: '', subjects: [] });
    setError('');
    setShowModal(true);
  };

  const openEdit = (cls) => {
    setEditItem(cls);
    setForm({
      name: cls.name,
      session: cls.session,
      subjects: cls.subject_names || [],
    });
    setError('');
    setShowModal(true);
  };

  const handleSubjectToggle = (subjectId) => {
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(subjectId)
        ? f.subjects.filter(id => id !== subjectId)
        : [...f.subjects, subjectId]
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.session) { setError('Name and session are required'); return; }
    try {
      const payload = { name: form.name, session: form.session, subjects: form.subjects };
      if (editItem) {
        await updateClass(editItem.id, payload);
      } else {
        await createClass(payload);
      }
      setShowModal(false);
      loadData();
    } catch (e) {
      setError('Something went wrong. Check the fields and try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class?')) return;
    await deleteClass(id);
    loadData();
  };

  if (loading) return <div className="loading">Loading classes...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Classes</h1>
          <p className="page-subtitle">{classes.length} classes total</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Class</button>
      </div>

      <div className="cards-grid">
        {classes.map(cls => (
          <div className="class-card" key={cls.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="class-card-name">{cls.name}</div>
                <div className="class-card-session">{cls.session}</div>
              </div>
              <div className="action-btns">
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(cls)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cls.id)}>Delete</button>
              </div>
            </div>
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
            {cls.subject_names && cls.subject_names.length > 0 && (
              <div className="chips" style={{ marginTop: 10 }}>
                {cls.subject_names.map((s, i) => (
                  <span className="chip" key={i}>{s}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {classes.length === 0 && (
          <div className="empty-state"><p>No classes yet. Create your first class.</p></div>
        )}
      </div>

      {showModal && (
        <Modal title={editItem ? 'Edit Class' : 'New Class'} onClose={() => setShowModal(false)}>
          {error && <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 12 }}>{error}</p>}
          <div className="form-group">
            <label className="form-label">Class Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Class A" />
          </div>
          <div className="form-group">
            <label className="form-label">Session</label>
            <input value={form.session} onChange={e => setForm({ ...form, session: e.target.value })} placeholder="e.g. 2025/2026" />
          </div>
          <div className="form-group">
            <label className="form-label">Subjects</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {subjects.map(s => (
                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    style={{ width: 'auto' }}
                    checked={form.subjects.includes(s.id)}
                    onChange={() => handleSubjectToggle(s.id)}
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editItem ? 'Save Changes' : 'Create Class'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Classes;