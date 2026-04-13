import React, { useState, useEffect } from 'react';
import { fetchSubjects, createSubject, updateSubject, deleteSubject } from '../api';
import Modal from '../components/Modal';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    coefficient: 1
  });

  const [error, setError] = useState('');

  const loadData = async () => {
    const data = await fetchSubjects();
    setSubjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', description: '', coefficient: 1 });
    setError('');
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditItem(s);
    setForm({
      name: s.name,
      description: s.description || '',
      coefficient: s.coefficient || 1
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name) {
      setError('Subject name is required');
      return;
    }

    try {
      if (editItem) {
        await updateSubject(editItem.id, form);
      } else {
        await createSubject(form);
      }

      setShowModal(false);
      loadData();
    } catch (e) {
      setError('Something went wrong. Try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    await deleteSubject(id);
    loadData();
  };

  if (loading) return <div className="loading">Loading subjects...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subjects</h1>
          <p className="page-subtitle">{subjects.length} subjects total</p>
        </div>

        <button className="btn btn-primary" onClick={openCreate}>
          + New Subject
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Description</th>
              <th>Coef</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                <td style={{ color: 'var(--gray-600)' }}>
                  {s.description || '—'}
                </td>
                <td>
                  <span className="badge">
                    {s.coefficient}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openEdit(s)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {subjects.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-state">
                  No subjects yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal
          title={editItem ? 'Edit Subject' : 'New Subject'}
          onClose={() => setShowModal(false)}
        >
          {error && (
            <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 12 }}>
              {error}
            </p>
          )}

          {/* NAME */}
          <div className="form-group">
            <label className="form-label">Subject Name</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="e.g. Mathematics"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Brief description..."
            />
          </div>

          {/* COEFFICIENT */}
          <div className="form-group">
            <label className="form-label">Coefficient</label>
            <input
              type="number"
              min="1"
              max="10"
              value={form.coefficient}
              onChange={(e) =>
                setForm({
                  ...form,
                  coefficient: Number(e.target.value)
                })
              }
            />
          </div>

          {/* ACTIONS */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              marginTop: 20
            }}
          >
            <button
              className="btn btn-ghost"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {editItem ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Subjects;