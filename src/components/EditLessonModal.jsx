import React, { useState, useEffect } from "react";
import axios from "axios";


const EditLessonModal = ({ lesson, onClose, onSave }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  
  const [lessonData, setLessonData] = useState({
    subject: lesson.subject,
    teacher: lesson.teacher?._id || lesson.teacher,
    lessonType: lesson.lessonType,
    period: lesson.period?._id || lesson.period,
    room: lesson.room?._id || lesson.room,
    date: new Date(lesson.date).toISOString().split('T')[0],
    group: lesson.group?._id || lesson.group,
    course: lesson.course?._id || lesson.course,
    specialty: lesson.specialty?._id || lesson.specialty,
    dayOfWeek: lesson.dayOfWeek || new Date(lesson.date).getDay()
  });

  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const [teachersRes, roomsRes, periodsRes] = await Promise.all([
          axios.get(`${API_URL}/teachers`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/rooms`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/periods`)
        ]);

        setTeachers(teachersRes.data);
        setClassrooms(roomsRes.data);
        setPeriods(periodsRes.data);

      } catch (error) {
        console.error("Помилка завантаження:", error);
        setError("Помилка завантаження даних");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "date") {
      const newDate = new Date(value);
      const newDayOfWeek = newDate.getDay();
      setLessonData(prev => ({
        ...prev,
        dayOfWeek: newDayOfWeek === 0 ? 6 : newDayOfWeek - 1
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/schedule/${lesson._id}`,
        lessonData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Пара успішно оновлена!");
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Помилка збереження:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Помилка при збереженні змін");
    }
  };

  if (loading) return <div className="loading">Завантаження...</div>;

  return (
    <div className="edit-lesson-modal-overlay">
      <div className="edit-lesson-modal">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Редагування пари</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Предмет:</label>
            <input
              type="text"
              name="subject"
              value={lessonData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Викладач:</label>
            <select
              name="teacher"
              value={lessonData.teacher}
              onChange={handleChange}
              required
            >
              <option value="">Оберіть викладача</option>
              {teachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Тип пари:</label>
            <select
              name="lessonType"
              value={lessonData.lessonType}
              onChange={handleChange}
              required
            >
              <option value="Практика">Практика</option>
            <option value="Лекція">Лекція</option> 
            <option value="Лабораторна">Лабораторна</option>
            <option value="Іспит">Іспит</option>
            <option value="Навчальна практика">Навчальна практика</option>
            <option value="Виїзна практика">Виїздна практика</option>
            </select>
          </div>

          <div className="form-group">
            <label>Період:</label>
            <select
              name="period"
              value={lessonData.period}
              onChange={handleChange}
              required
            >
              <option value="">Оберіть період</option>
              {periods.map(period => (
                <option key={period._id} value={period._id}>
                  {period.startTime} - {period.endTime}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Дата:</label>
            <input
              type="date"
              name="date"
              value={lessonData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Кабінет:</label>
            <select
              name="room"
              value={lessonData.room}
              onChange={handleChange}
              required
            >
              <option value="">Оберіть кабінет</option>
              {classrooms.map(room => (
                <option key={room._id} value={room._id}>{room.name}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Скасувати</button>
            <button type="submit">Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLessonModal;