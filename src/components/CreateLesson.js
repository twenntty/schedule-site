import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateLesson = () => {
    const navigate = useNavigate();
    const [specialties, setSpecialties] = useState([]);
    const [courses, setCourses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [weekDays, setWeekDays] = useState([]);

    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [subject, setSubject] = useState("");
    const [teacher, setTeacher] = useState("");
    const [lessonType, setLessonType] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedClassroom, setSelectedClassroom] = useState("");
    const [selectedWeekDay, setSelectedWeekDay] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);  // Для состояния загрузки

    const API_URL = process.env.REACT_APP_API_URL;

    // Загрузка данных
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);  // Начало загрузки
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Токен отсутствует. Пожалуйста, войдите в систему.");
                    return;
                }

                // Загрузка специальностей
                const specialtiesResponse = await axios.get(`${API_URL}/specialties`);
                setSpecialties(specialtiesResponse.data);

                // Загрузка периодов
                const periodsResponse = await axios.get(`${API_URL}/api/periods`);
                setPeriods(periodsResponse.data);

                // Загрузка дней недели
                const weekdaysResponse = await axios.get(`${API_URL}/api/weekdays`);
                setWeekDays(weekdaysResponse.data);

                // Загрузка кабинетов
                const classroomsResponse = await axios.get(`${API_URL}/api/rooms`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClassrooms(classroomsResponse.data);
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
                setError("Ошибка загрузки данных");
            } finally {
                setLoading(false);  // Конец загрузки
            }
        };

        fetchData();
    }, [API_URL]);

    // Загрузка курсов и групп по специальности
    useEffect(() => {
        const fetchCourses = async () => {
            if (!selectedSpecialty) return;
            try {
                const response = await axios.get(`${API_URL}/courses/${selectedSpecialty}`);
                setCourses(response.data);
            } catch (error) {
                console.error("Ошибка загрузки курсов:", error);
                setError("Ошибка загрузки курсов");
            }
        };

        fetchCourses();
    }, [selectedSpecialty, API_URL]);

    useEffect(() => {
        const fetchGroups = async () => {
            if (!selectedCourse) return;  // Прекращаем запрос, если курс не выбран
            try {
                const response = await axios.get(`${API_URL}/groups/${selectedCourse}`);
                setGroups(response.data);
            } catch (error) {
                // Логирование полной ошибки
                console.error("Ошибка загрузки групп:", error.response || error);
                setError(`Ошибка загрузки групп: ${error.response ? error.response.data : error.message}`);
            }
        };
    
        fetchGroups();
    }, [selectedCourse, API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Логируем все данные перед отправкой
        const formData = {
            subject,
            teacher,
            lessonType,
            period: selectedPeriod,
            group: selectedGroup,
            room: selectedClassroom,  // правильное имя поля
            dayOfWeek: Number(selectedWeekDay),  // преобразуем dayOfWeek в число
        };
    
        console.log('Отправляемые данные:', formData);  // Логируем данные
    
        if (!selectedWeekDay || !selectedClassroom || !subject || !teacher || !lessonType || !selectedPeriod || !selectedGroup) {
            setError("Пожалуйста, заполните все поля!");
            return;
        }
    
        try {
            const token = localStorage.getItem("token");
            setLoading(true);  // Начало загрузки
    
            const response = await axios.post(
                `${API_URL}/api/schedule`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            console.log('Ответ от сервера:', response.data); // Логируем ответ сервера
    
            alert("Пара успешно добавлена!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Ошибка при добавлении пары:", error);
    
            // Логируем подробности ошибки
            if (error.response) {
                console.error("Ответ сервера:", error.response.data);
                setError(error.response.data.message || "Ошибка при добавлении пары");
            }
    
            alert("Ошибка при добавлении пары");
        } finally {
            setLoading(false);  // Конец загрузки
        }
    };

    return (
        <div>
            <h2>Добавить новую пару</h2>
            
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {loading && <div>Загрузка...</div>}  {/* Показ сообщения о загрузке */}

            <form onSubmit={handleSubmit}>
                <label>Специальность:</label>
                <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} required>
                    <option value="">Выберите специальность</option>
                    {specialties.map((spec) => (
                        <option key={spec._id} value={spec._id}>{spec.name}</option>
                    ))}
                </select>

                <label>Курс:</label>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required disabled={!selectedSpecialty}>
                    <option value="">Выберите курс</option>
                    {courses.map((course) => (
                        <option key={course._id} value={course._id}>{course.name}</option>
                    ))}
                </select>

                <label>Группа:</label>
                <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} required disabled={!selectedCourse}>
                    <option value="">Выберите группу</option>
                    {groups.map((group) => (
                        <option key={group._id} value={group._id}>{group.name}</option>
                    ))}
                </select>

                <label>День недели:</label>
                <select value={selectedWeekDay} onChange={(e) => setSelectedWeekDay(e.target.value)} required>
                    <option value="">Выберите день недели</option>
                    {weekDays.map((day) => (
                        <option key={day.id} value={day.id}>{day.name}</option>
                    ))}
                </select>

                <label>Название предмета:</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />

                <label>Преподаватель:</label>
                <input type="text" value={teacher} onChange={(e) => setTeacher(e.target.value)} required />

                <label>Тип пары:</label>
                <select value={lessonType} onChange={(e) => setLessonType(e.target.value)} required>
                    <option value="">Выберите тип пары</option>
                    <option value="Лекция">Лекция</option>
                    <option value="Практика">Практика</option>
                    <option value="Лабораторная">Лабораторная</option>
                    <option value="Экзамен">Экзамен</option>
                    <option value="Учебная практика">Учебная практика</option>
                    <option value="Выездная практика">Выездная практика</option>
                </select>

                <label>Кабинет:</label>
                <select value={selectedClassroom} onChange={(e) => setSelectedClassroom(e.target.value)} required>
                    <option value="">Выберите кабинет</option>
                    {classrooms.map((room) => (
                        <option key={room._id} value={room._id}>{room.name}</option>
                    ))}
                </select>

                <label>Период:</label>
                <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} required>
                    <option value="">Выберите период</option>
                    {periods.map((period) => (
                        <option key={period._id} value={period._id}>{period.name}</option>
                    ))}
                </select>

                <button type="submit" disabled={loading}>Добавить пару</button>
            </form>
        </div>
    );
};

export default CreateLesson;
