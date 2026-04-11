const BASE_URL = 'http://127.0.0.1:8000/api';

const fetchJson = async (url, options = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  if (response.status === 204) return null;
  return response.json();
};

// Classes
export const fetchClasses = () => fetchJson('/classes/');
export const createClass = (data) => fetchJson('/classes/', { method: 'POST', body: JSON.stringify(data) });
export const updateClass = (id, data) => fetchJson(`/classes/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteClass = (id) => fetchJson(`/classes/${id}/`, { method: 'DELETE' });

// Students
export const fetchStudents = () => fetchJson('/students/');
export const createStudent = (data) => fetchJson('/students/', { method: 'POST', body: JSON.stringify(data) });
export const updateStudent = (id, data) => fetchJson(`/students/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteStudent = (id) => fetchJson(`/students/${id}/`, { method: 'DELETE' });

// Subjects
export const fetchSubjects = () => fetchJson('/subjects/');
export const createSubject = (data) => fetchJson('/subjects/', { method: 'POST', body: JSON.stringify(data) });
export const updateSubject = (id, data) => fetchJson(`/subjects/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteSubject = (id) => fetchJson(`/subjects/${id}/`, { method: 'DELETE' });

// Grades
export const fetchGrades = () => fetchJson('/grades/');
export const createGrade = (data) => fetchJson('/grades/', { method: 'POST', body: JSON.stringify(data) });
export const updateGrade = (id, data) => fetchJson(`/grades/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteGrade = (id) => fetchJson(`/grades/${id}/`, { method: 'DELETE' });
export const fetchFilterOptions = (classId) => fetchJson(`/grades/filter-options/?class_id=${classId}`);