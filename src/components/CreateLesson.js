import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "../styles/CreateLesson.css"
import "../styles/CreateRoom.css";
import "../styles/EditLessonModal.css";

const CreateLesson = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [date, setDate] = useState(moment().add(1, 'days').format("YYYY-MM-DD"));
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedWeekDayId, setSelectedWeekDayId] = useState("");
  const [lessonType, setLessonType] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [error, setError] = useState("");
  const [periods, setPeriods] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const formRef = useRef();
  const [schedule, setSchedule] = useState([]);
  
      const weekDays = [
          { id: 1, name: "Понеділок" },
          { id: 2, name: "Вівторок" },
          { id: 3, name: "Середа" },
          { id: 4, name: "Четвер" },
          { id: 5, name: "Пʼятниця" },
          { id: 6, name: "Субота" },
      ];
  
      const { startOfWeek, endOfWeek } = useMemo(() => {
        const today = new Date();
        const currentDay = today.getDay() === 0 ? 7 : today.getDay();

        let start = new Date(today);

        if (currentDay === 7) {
          // Сегодня воскресенье - берём понедельник следующей недели
          start.setDate(today.getDate() + 1); 
        } else {
          // Иначе - понедельник текущей недели
          start.setDate(today.getDate() - currentDay + 1);
        }
        
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 5); // с Пн по Сб (6 дней)
        end.setHours(23, 59, 59, 999);

        return { startOfWeek: start, endOfWeek: end };
      }, []);
  
      const lessonTypeAbbreviations = {
          "Практика": "Пр",
          "Лекція": "Лк",
          "Лабораторна": "Лб",
          "Іспит": "Екз", 
          "Навчальна практика": "НП", 
          "Виїздна практика": "ВП"
      };
  
      useEffect(() => {
          const fetchSpecialties = async () => {
              setLoading(true);
              try {
                  const response = await axios.get(`${process.env.REACT_APP_API_URL}/specialties`);
                  setSpecialties(response.data);
              } catch {
                  setError("Помилка загрузки спеціальностей");
              } finally {
                  setLoading(false);
              }
          };
          fetchSpecialties();
      }, []);

      // Disciplines of this institution — used for subject autocomplete.
      useEffect(() => {
          axios.get(`${process.env.REACT_APP_API_URL}/disciplines`)
              .then((res) => setDisciplines(res.data))
              .catch(() => {});
      }, []);
  

      const fetchSchedule = async () => {
        if (!selectedGroup) return;
        setLoading(true);
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/schedule/group/${selectedGroup}/week/`);
          const filteredSchedule = response.data.filter(lesson => {
            const lessonDate = new Date(lesson.date);
            return lessonDate >= startOfWeek && lessonDate <= endOfWeek;
          });
          setSchedule(filteredSchedule);
        } catch {
          setError("Помилка загрузки розкладу");
        } finally {
          setLoading(false);
        }
      };
  
      useEffect(() => {
        fetchSchedule();
      }, [selectedGroup, startOfWeek, endOfWeek]);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (notification) {
      setTimeout(() => setNotification(""), 5000);
    }
  }, [notification]);

  // Загрузка начальных данных (специальности, преподаватели, кабинеты, периоды)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [specialtiesResponse, teachersResponse, classroomsResponse, periodsResponse] = await Promise.all([
          axios.get(`${API_URL}/specialties`),
          axios.get(`${API_URL}/teachers`),
          axios.get(`${API_URL}/api/rooms`),
          axios.get(`${API_URL}/api/periods`),
        ]);

        setSpecialties(specialtiesResponse.data);
        setTeachers(teachersResponse.data);
        setClassrooms(classroomsResponse.data);
        setPeriods(periodsResponse.data);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // Загрузка курсов при выборе специальности
  useEffect(() => {
    if (!selectedSpecialty) return;

    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/courses/${selectedSpecialty}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
      } catch (error) {
        console.error("Ошибка загрузки курсов:", error);
        setError("Ошибка загрузки курсов");
      }
    };

    fetchCourses();
  }, [selectedSpecialty, API_URL]);

  // Загрузка групп при выборе курса
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/groups/${selectedCourse}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(response.data);
      } catch (error) {
        console.error("Ошибка загрузки групп:", error);
        setError("Ошибка загрузки групп");
      }
    };

    fetchGroups();
  }, [selectedCourse, API_URL]);

  // Определение дня недели по выбранной дате
  useEffect(() => {
    if (!date) return;

    const isValidDate = moment(date, "YYYY-MM-DD", true).isValid();
    if (!isValidDate) {
      console.error("Некорректный формат даты");
      return;
    }

    const fetchWeekDay = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/weekday`, {
          params: { date },
          headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedWeekDayId(response.data.weekDayId);
      } catch (error) {
        console.error("Ошибка при получении дня недели:", error);
        setError("Ошибка при получении дня недели");
      }
    };

    fetchWeekDay();
  }, [date, API_URL]);

  // Обработка отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Проверка на заполнение обязательных полей
    if (!selectedCourse || !selectedSpecialty || !selectedGroup || !selectedTeacher || !subject || !lessonType || !selectedPeriod || !selectedClassroom || !date) {
      setError("Пожалуйста, заполните все обязательные поля.");
      return;
    }

      const resetForm = () => {
        const tomorrow = moment().add(1, 'days').format("YYYY-MM-DD");

        setDate(tomorrow);
        setSelectedPeriod("");
        setSelectedWeekDayId("");
        setLessonType("");
        setSelectedTeacher("");
        setSubject("");
        setSelectedClassroom("")
      };

    // Подготовка данных для отправки
    const lessonData = {
      subject,
      teacher: selectedTeacher,
      period: selectedPeriod,
      lessonType,
      group: selectedGroup,
      room: selectedClassroom,
      dayOfWeek: parseInt(selectedWeekDayId),
      date,
      specialty: selectedSpecialty,
      course: selectedCourse,
    };


    try {
      await axios.post(`${API_URL}/api/schedule`, lessonData); // auth via cookie
      setModalOpen(false);
      resetForm();
      await fetchSchedule();
    } catch (error) {
      console.error("Ошибка при добавлении пары:", error);
      setError("Ошибка при добавлении пары");
    }
  };



  return (
    <div className="MainSchedules">
      <div className="add-lesson-head">
        <p className="text">Додати пару</p>
        <button type="button" className="buttonForScheduleAdd" disabled={!selectedGroup} onClick={() => setModalOpen(true)}>
          + Додати пару
        </button>
      </div>

      <div className="add-lesson-filters">
        <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} className="InputSchedule">
          <option value="">Оберіть спеціальність</option>
          {specialties.map((spec) => <option key={spec._id} value={spec._id}>{spec.name}</option>)}
        </select>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="InputSchedule" disabled={!selectedSpecialty}>
          <option value="">Оберіть курс</option>
          {courses.map((course) => <option key={course._id} value={course._id}>{course.name}</option>)}
        </select>
        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="InputSchedule" disabled={!selectedCourse}>
          <option value="">Оберіть групу</option>
          {groups.map((group) => <option key={group._id} value={group._id}>{group.name}</option>)}
        </select>
      </div>

      {loading && <p className="schedule-status">Завантаження…</p>}

      {modalOpen && (
        <div className="edit-lesson-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="edit-lesson-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setModalOpen(false)} aria-label="Закрити">&times;</button>
            <h2>Додати пару</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} ref={formRef}>
              <p className="modal-context">
                {specialties.find((s) => s._id === selectedSpecialty)?.name} · {courses.find((c) => c._id === selectedCourse)?.name} · група {groups.find((g) => g._id === selectedGroup)?.name}
              </p>
              <div className="form-group">
                <label>Предмет:</label>
                <input
                  type="text"
                  list="lesson-disciplines"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Почніть вводити назву…"
                  required
                  autoComplete="off"
                />
                <datalist id="lesson-disciplines">
                  {disciplines.map((d) => <option key={d._id} value={d.name} />)}
                </datalist>
              </div>
              <div className="form-group">
                <label>Викладач:</label>
                <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)} required>
                  <option value="">Оберіть викладача</option>
                  {teachers.map((teacher) => <option key={teacher._id} value={teacher._id}>{teacher.fullName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Тип пари:</label>
                <select value={lessonType} onChange={(e) => setLessonType(e.target.value)} required>
                  <option value="">Оберіть тип пари</option>
                  <option value="Практика">Практика</option>
                  <option value="Лекція">Лекція</option>
                  <option value="Лабораторна">Лабораторна</option>
                  <option value="Іспит">Іспит</option>
                  <option value="Навчальна практика">Навчальна практика</option>
                  <option value="Виїзна практика">Виїзна практика</option>
                </select>
              </div>
              <div className="form-group">
                <label>Кабінет:</label>
                <select value={selectedClassroom} onChange={(e) => setSelectedClassroom(e.target.value)} required>
                  <option value="">Оберіть кабінет</option>
                  {classrooms.map((classroom) => <option key={classroom._id} value={classroom._id}>{classroom.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Тривалість пари:</label>
                <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} required>
                  <option value="">Оберіть тривалість</option>
                  {periods.map((period) => <option key={period._id} value={period._id}>{period.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Дата:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setModalOpen(false)}>Скасувати</button>
                <button type="submit">Додати</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="schedule-container_ForLesson">
                {weekDays.map((day) => (
                    <div key={day.id} className="day-column">
                        <span className="day_Name">{day.name}</span>
                        {schedule
                            .filter((lesson) => lesson.dayOfWeek === day.id)
                            .map((lesson) => (
                                <div key={lesson._id} className="lesson-card">
                                    <div className="lesson-card__head">
                                        <span className="lesson-card__time">{lesson.period?.startTime} – {lesson.period?.endTime}</span>
                                        <span className="lesson-type" data-type={lesson.lessonType}>
                                            {lessonTypeAbbreviations[lesson.lessonType] || lesson.lessonType}
                                        </span>
                                    </div>
                                    <div className="lesson-card__subject">{lesson.subject}</div>
                                    <div className="lesson-card__meta">
                                        <span>
                                            {lesson.teacher ? (
                                                <>
                                                    {lesson.teacher.lastName} {lesson.teacher.firstName ? lesson.teacher.firstName.charAt(0) + "." : ""} {lesson.teacher.middleName ? lesson.teacher.middleName.charAt(0) + "." : ""}
                                                </>
                                            ) : (
                                                "Викладач не вказаний"
                                            )}
                                        </span>
                                        <span>{lesson.room ? lesson.room.name : "Не вказано"}</span>
                                    </div>
                                </div>
                            ))}
                        {schedule.filter((lesson) => lesson.dayOfWeek === day.id).length === 0 && (
                            <div className="lesson-card empty">Немає пар</div>
                        )}
                    </div>
                ))}
            </div>
    </div>
  );
};

export default CreateLesson;