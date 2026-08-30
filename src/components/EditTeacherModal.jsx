import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EditLessonModal.css";
import "../styles/EditTeacherModal.css";

const ids = (arr) => (arr || []).map((x) => (typeof x === "object" ? x._id : x));

const EditTeacherModal = ({ teacher, onClose, onSave }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [form, setForm] = useState({
    lastName: teacher.lastName || "",
    firstName: teacher.firstName || "",
    middleName: teacher.middleName || "",
  });
  const [disciplines, setDisciplines] = useState([]);
  const [canTeach, setCanTeach] = useState(ids(teacher.subjectsCanTeach));
  const [canReplace, setCanReplace] = useState(ids(teacher.subjectsCanReplace));
  const [teachInput, setTeachInput] = useState("");
  const [replaceInput, setReplaceInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${apiUrl}/disciplines`)
      .then((r) => setDisciplines(r.data))
      .catch(() => setError("Помилка завантаження дисциплін"))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const nameOf = (id) => disciplines.find((d) => d._id === id)?.name || "—";

  // Add a discipline (by typed name) to a list if it exists and isn't there yet.
  const addByName = (name, list, setList, setInput) => {
    const d = disciplines.find((x) => x.name.trim().toLowerCase() === name.trim().toLowerCase());
    if (d && !list.includes(d._id)) setList([...list, d._id]);
    setInput("");
  };
  const removeId = (id, list, setList) => setList(list.filter((x) => x !== id));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${apiUrl}/teachers/${teacher._id}`, {
        ...form,
        subjectsCanTeach: canTeach,
        subjectsCanReplace: canReplace,
      });
      onSave(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Помилка збереження");
    }
  };

  const renderTagField = (title, list, setList, input, setInput) => (
    <div className="subj-section">
      <p className="subj-title">{title}</p>
      {list.length > 0 && (
        <div className="tag-list">
          {list.map((id) => (
            <span key={id} className="tag">
              {nameOf(id)}
              <button type="button" className="tag__remove" onClick={() => removeId(id, list, setList)} aria-label="Прибрати">&times;</button>
            </span>
          ))}
        </div>
      )}
      <input
        className="tag-input"
        list="teacher-disciplines"
        value={input}
        placeholder="Введіть дисципліну…"
        autoComplete="off"
        onChange={(e) => {
          const v = e.target.value;
          setInput(v);
          // If the typed value exactly matches a discipline (e.g. picked from the list), add it.
          if (disciplines.some((d) => d.name.trim().toLowerCase() === v.trim().toLowerCase())) {
            addByName(v, list, setList, setInput);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); addByName(input, list, setList, setInput); }
        }}
      />
    </div>
  );

  return (
    <div className="edit-lesson-modal-overlay" onClick={onClose}>
      <div className="edit-lesson-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Закрити">&times;</button>
        <h2>Редагування викладача</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Прізвище:</label>
            <input name="lastName" value={form.lastName} onChange={change} required />
          </div>
          <div className="form-group">
            <label>Імʼя:</label>
            <input name="firstName" value={form.firstName} onChange={change} required />
          </div>
          <div className="form-group">
            <label>По батькові:</label>
            <input name="middleName" value={form.middleName} onChange={change} required />
          </div>

          {loading ? (
            <div className="loading">Завантаження дисциплін…</div>
          ) : disciplines.length === 0 ? (
            <p className="subj-empty">Спочатку додайте дисципліни у вкладці «Дисципліни».</p>
          ) : (
            <>
              {renderTagField("Може вести", canTeach, setCanTeach, teachInput, setTeachInput)}
              {renderTagField("Може заміняти", canReplace, setCanReplace, replaceInput, setReplaceInput)}
              <datalist id="teacher-disciplines">
                {disciplines.map((d) => <option key={d._id} value={d.name} />)}
              </datalist>
            </>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose}>Скасувати</button>
            <button type="submit">Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherModal;
