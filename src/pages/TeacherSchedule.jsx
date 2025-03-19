import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../styles/TeacherSchedule.css";

const TeacherSchedule = () => {
    const [teachers, setTeachers] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [loadingTeachers, setLoadingTeachers] = useState(false);
    const [loadingSchedule, setLoadingSchedule] = useState(false);
    const [errorTeachers, setErrorTeachers] = useState("");
    const [errorSchedule, setErrorSchedule] = useState("");

    const weekDays = useMemo(() => [
        { id: 1, name: "Понеділок" },
        { id: 2, name: "Вівторок" },
        { id: 3, name: "Середа" },
        { id: 4, name: "Четвер" },
        { id: 5, name: "Пʼятниця" },
        { id: 6, name: "Субота" },
    ], []);

    // Определение начала и конца текущей недели
    const { startOfWeek, endOfWeek } = useMemo(() => {
        const today = new Date();
        const currentDay = today.getDay() === 0 ? 7 : today.getDay(); // Воскресенье → 7
        const start = new Date(today);
        start.setDate(today.getDate() - currentDay + 1);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 5);
        end.setHours(23, 59, 59, 999);

        return { startOfWeek: start, endOfWeek: end };
    }, []);
    
    // Получение списка преподавателей
    useEffect(() => {
        const fetchTeachers = async () => {
            setLoadingTeachers(true);
            setErrorTeachers("");
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/teachers`);
                setTeachers(response.data);
            } catch (err) {
                setErrorTeachers("Помилка загрузки викладачів");
                console.error("Teachers Error:", err);
            } finally {
                setLoadingTeachers(false);
            }
        };

        fetchTeachers();
    }, []);

    // Получение расписания выбранного преподавателя
    const handleTeacherChange = async (e) => {
        const teacherId = e.target.value;
        setSelectedTeacher(teacherId);
        setSchedule([]);
        setErrorSchedule("");

        if (!teacherId) return;

        setLoadingSchedule(true);

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/schedule/teacher/${teacherId}`);
            const filteredSchedule = response.data.filter(lesson => {
                const lessonDate = new Date(lesson.date);
                return lessonDate >= startOfWeek && lessonDate <= endOfWeek;
            });

            setSchedule(filteredSchedule);
        } catch (err) {
            setErrorSchedule("Помилка загрузки розкладу");
            console.error("Schedule Error:", err);
        } finally {
            setLoadingSchedule(false);
        }
    };

const scheduleByDay = useMemo(() => {
    const lessonTypeAbbreviations = {
        "Практика": "Пр",
        "Лекція": "Лк",
        "Лабораторна": "Лб",
        "Іспит": "Екз", 
        "Навчальна практика": "НП", 
        "Виїздна практика": "ВП"
    };

    return weekDays.map(day => ({
        ...day,
        lessons: schedule
            .filter(lesson => lesson.dayOfWeek === day.id)
            .sort((a, b) => (a.period?.startTime || "").localeCompare(b.period?.startTime || ""))
            .map(lesson => ({
                ...lesson,
                lessonType: lessonTypeAbbreviations[lesson.lessonType] || lesson.lessonType
            }))
    }));
}, [schedule, weekDays]);

    return (
        <div className="teacher-schedule-container">
            {/* Выбор преподавателя */}
            <div className="ValueTeacher">
                <select 
                    value={selectedTeacher} 
                    onChange={handleTeacherChange}
                    disabled={loadingTeachers}
                    className="ValueUniversityInfo_Teacher"
                >
                    <option value="">Оберіть Викладача</option>
                    {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                            {teacher.fullName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Индикация загрузки */}
            {loadingTeachers && <div className="loading">Завантаження викладачів...</div>}
            {errorTeachers && <div className="error">{errorTeachers}</div>}
            {loadingSchedule && <div className="loading">Завантаження розкладу...</div>}
            {errorSchedule && <div className="error">{errorSchedule}</div>}

            {/* Отображение расписания */}
            <div className="schedule-grid">
                {scheduleByDay.map(({ id, name, lessons }) => (
                    <div key={id} className="day-column">
                        <span className="day_Name">{name}</span>

                        {/* Если уроков нет */}
                        {lessons.length === 0 ? (
                            <div className="lesson-card empty">
                                Немає пар
                            </div>
                        ) : (
                            // Вывод занятий на день
                            lessons.map(lesson => (
                                <div key={lesson._id} className="lesson-card">
                                    <div className="lesson-subject">
                                        {lesson.subject} [{lesson.lessonType}]
                                    </div>
                                    <div className="lesson-time">
                                        {lesson.period?.startTime || "??:??"} - {lesson.period?.endTime || "??:??"}
                                    </div>
                                    <div className="lesson-meta">
                                        <span className="lesson-room">
                                            {lesson.room?.name || "Аудиторія не вказана"}
                                        </span>
                                        <br />
                                        <span className="lesson-group">
                                            {lesson.group?.name || "Група не вказана"} група
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherSchedule;
