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

    // Исправленный словарь переводов типов занятий
    const lessonTypeTranslations = useMemo(() => ({
        'Лекція': '[Лк]',
        'Практика': '[Пр]',
        'Лаб': '[Лб]',
        'Іспит': '[Екз]',
        'Навчальна практика': '[НП]',
        'Виїзна практика': '[ВП]'
    }), []);

    useEffect(() => {
        const abortController = new AbortController();
        
        const fetchTeachers = async () => {
            setLoadingTeachers(true);
            setErrorTeachers("");
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/teachers`,
                    { signal: abortController.signal }
                );
                setTeachers(response.data);
            } catch (err) {
                if (!abortController.signal.aborted) {
                    setErrorTeachers("Помилка загрузки викладачів");
                    console.error("Teachers Error:", err);
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setLoadingTeachers(false);
                }
            }
        };
        
        fetchTeachers();
        return () => abortController.abort();
    }, []);

    const handleTeacherChange = async (e) => {
        const teacherId = e.target.value;
        setSelectedTeacher(teacherId);
        setSchedule([]);
        setErrorSchedule("");
    
        if (!teacherId) return;
    
        const source = axios.CancelToken.source();
        setLoadingSchedule(true);
        
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/schedule/teacher/${teacherId}`,
                { cancelToken: source.token }
            );
            
            const sortedSchedule = response.data.sort((a, b) => 
                (a.period?.startTime || "").localeCompare(b.period?.startTime || "")
            );
            
            setSchedule(sortedSchedule);
        } catch (err) {
            if (!axios.isCancel(err)) {
                setErrorSchedule("Помилка загрузки розкладу");
                console.error("Schedule Error:", err);
            }
        } finally {
            setLoadingSchedule(false);
        }
    };

    const scheduleByDay = useMemo(() => {
        return weekDays.map(day => ({
            ...day,
            lessons: schedule
                .filter(lesson => lesson.dayOfWeek === day.id)
                .sort((a, b) => 
                    (a.period?.startTime || "").localeCompare(b.period?.startTime || "")
                )
        }));
    }, [schedule, weekDays]);

    return (
        <div className="teacher-schedule-container">
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

            {loadingTeachers && <div className="loading">Завантаження викладачів...</div>}
            {errorTeachers && <div className="error">{errorTeachers}</div>}

            {loadingSchedule && <div className="loading">Завантаження розкладу...</div>}
            {errorSchedule && <div className="error">{errorSchedule}</div>}

            <div className="schedule-grid">
                {scheduleByDay.map(({ id, name, lessons }) => (
                    <div key={id} className="day-column">
                        <span className="day_Name">{name}</span>
                        
                        {lessons.length === 0 ? (
                            <div className="lesson-card empty">
                                Немає пар
                            </div>
                        ) : (
                            lessons.map(lesson => (
                                <div key={lesson._id} className="lesson-card">
                                    <div className="lesson-subject">{lesson.subject} {lessonTypeTranslations[lesson.lessonType] || "Тип не вказано"}</div>
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