import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "../styles/CreateLesson.css"

const CreateLesson = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [date, setDate] = useState("");
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
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const formRef = useRef();

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
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Токен не найден, выполните вход.");
          console.error("Токен не найден");
          setLoading(false);
          return;
        }

        const [specialtiesResponse, teachersResponse, classroomsResponse, periodsResponse] = await Promise.all([
          axios.get(`${API_URL}/specialties`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/teachers`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/rooms`, { headers: { Authorization: `Bearer ${token}` } }),
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

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Токен не найден, выполните вход.");
      return;
    }

    // Проверка на заполнение обязательных полей
    if (!selectedCourse || !selectedSpecialty || !selectedGroup || !selectedTeacher || !subject || !lessonType || !selectedPeriod || !selectedClassroom || !date) {
      setError("Пожалуйста, заполните все обязательные поля.");
      return;
    }

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

    console.log("Отправляемые данные:", lessonData);

    try {
      await axios.post(`${API_URL}/api/schedule`, lessonData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(`Пара створена для групи ${groups.find(g => g._id === selectedGroup)?.name || ""}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Ошибка при добавлении пары:", error);
      setError("Ошибка при добавлении пары");
    }
  };

  return (
    <div className="MainSchedules">
      <div className="ScheduleTextDashboard">
                <p className="text">Додати пару</p>
            </div>
      {loading && <div>Загрузка...</div>}

      <form onSubmit={handleSubmit} ref={formRef}>

      <div className="InputOneForSchedule">
          <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} required className="InputSchedule">
            <option value="">Оберіть спеціальність</option>
            {specialties.map((spec) => (
              <option key={spec._id} value={spec._id}>
                {spec.name}
              </option>
            ))}
          </select>

          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required className="InputSchedule">
            <option value="">Оберіть курс</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>

          <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} required className="InputSchedule">
            <option value="">Оберіть групу</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="InputTwoForSchedule">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="InputSchedule" />

        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Назва предмету"
          required
          className="InputSerchCabinet"
        />
        </div>
        
        <div className="InputThreeForSchedule">
        <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)} required className="InputSchedule">
          <option value="">Оберіть викладача</option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.fullName}
            </option>
          ))}
        </select>

        <select value={lessonType} onChange={(e) => setLessonType(e.target.value)} required className="InputSchedule">
          <option value="">Оберіть тип пари</option>
          <option value="Практика">Практика</option>
          <option value="Лекція">Лекція</option> 
          <option value="Лабораторна">Лабораторна</option>
          <option value="Іспит">Іспит</option>
          <option value="Навчальна практика">Навчальна практика</option>
          <option value="Виїзна практика">Виїздна практика</option>
        </select>
        </div>

        <div className="InputFourForSchedule">

        <select value={selectedClassroom} onChange={(e) => setSelectedClassroom(e.target.value)} required className="InputSchedule">
          <option value="">Оберіть кабінет</option>
          {classrooms.map((classroom) => (
            <option key={classroom._id} value={classroom._id}>
              {classroom.name}
            </option>
          ))}
        </select>

        <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} required className="InputSchedule">
          <option value="">Тривалість пари</option>
          {periods.map((period) => (
            <option key={period._id} value={period._id}>
              {period.name}
            </option>
          ))}
        </select>

          <div 
          className="buttonForScheduleAdd"
          onClick={() => !loading && formRef.current.requestSubmit()}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => !loading && e.key === 'Enter' && formRef.current.requestSubmit()}
        >
          Додати
        </div>

        </div>

        
      </form>
    </div>
  );
};

export default CreateLesson;