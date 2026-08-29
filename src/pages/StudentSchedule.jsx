import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../styles/StudentSchedule.css";

const StudentSchedule = () => {
    const [specialties, setSpecialties] = useState([]);
    const [courses, setCourses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [schedule, setSchedule] = useState([]);

    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
        const isSunday = today.getDay() === 0;

        // Если воскресенье - начнем отсчет с понедельника следующей недели
        const offset = isSunday ? 1 + 7 : 1; // 1 - понедельник
        const start = new Date(today);
        start.setDate(today.getDate() - (today.getDay() || 7) + offset); // (0 - вс) => 7
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 5); // до субботы
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

    const handleSpecialtyChange = async (e) => {
        const specialtyId = e.target.value;
        setSelectedSpecialty(specialtyId);
        setSelectedCourse("");
        setSelectedGroup("");
        setGroups([]);
        setSchedule([]);

        if (!specialtyId) {
            setCourses([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/courses/${specialtyId}`);
            setCourses(response.data);
        } catch {
            setError("Помилка загрузки курсів");
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = async (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        setSelectedGroup("");
        setGroups([]);
        setSchedule([]);

        if (!courseId) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/groups/${courseId}`);
            setGroups(response.data);
        } catch {
            setError("Помилка загрузки груп");
        } finally {
            setLoading(false);
        }
    };

    const handleExportCalendar = async () => {
    if (!selectedGroup) return;

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/schedule/group/${selectedGroup}/export-week.ics`);
        if (!response.ok) throw new Error("Помилка експорту");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `schedule_${selectedGroup}.ics`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Помилка експорту в календар:", error);
        alert("Не вдалося експортувати календар");
    }
    };

    const handleExportExcel = async () => {
    if (!selectedGroup) return;

    try {
        const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/schedule/group/${selectedGroup}/export-week.xlsx`
        );
        if (!response.ok) throw new Error("Помилка експорту Excel");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `schedule_${selectedGroup}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("❌ Помилка експорту в Excel:", error);
        alert("Не вдалося експортувати Excel-файл");
    }
    };

    useEffect(() => {
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

        fetchSchedule();
    }, [selectedGroup, startOfWeek, endOfWeek]);

    return (
        <div>
            <div className="ValueForSchedule">
                <select value={selectedSpecialty} onChange={handleSpecialtyChange} className="ValueUniversityInfo_Spec">
                    <option value="">Оберіть Спеціальність</option>
                    {specialties.map((spec) => (
                        <option key={spec._id} value={spec._id}>{spec.name}</option>
                    ))}
                </select>
                <select value={selectedCourse} onChange={handleCourseChange} className="ValueUniversityInfo_Course">
                    <option value="">Оберіть Курс</option>
                    {courses.map((course) => (
                        <option key={course._id} value={course._id}>{course.name}</option>
                    ))}
                </select>
                <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="ValueUniversityInfo_Groups">
                    <option value="">Оберіть Групу</option>
                    {groups.map((group) => (
                        <option key={group._id} value={group._id}>{group.name}</option>
                    ))}
                </select>
                <button onClick={handleExportCalendar} className="export-button">
                    Експорт у календар
                </button>
                <button onClick={handleExportExcel} className="export-button export-button--primary">
                    Друк
                </button>
            </div>
            {loading && <p className="schedule-status">Завантаження…</p>}
            {error && <p className="schedule-status error">{error}</p>}
            <div className="schedule-container">
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
                                        <span>{lesson.room ? lesson.room.name : "Аудиторія не вказана"}</span>
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

export default StudentSchedule;
