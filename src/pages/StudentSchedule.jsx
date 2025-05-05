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

    // useMemo для расчёта дат начала и конца текущей недели
    const { startOfWeek, endOfWeek } = useMemo(() => {
        const today = new Date();
        const currentDay = today.getDay() === 0 ? 7 : today.getDay(); // Преобразуем воскресенье в 7
        const start = new Date(today);
        start.setDate(today.getDate() - currentDay + 1);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 5);
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

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!selectedGroup) return;
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/schedule/${selectedGroup}`);
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
            </div>
            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="schedule-container">
                {weekDays.map((day) => (
                    <div key={day.id} className="day-column">
                        <span className="day_Name">{day.name}</span>
                        {schedule
                            .filter((lesson) => lesson.dayOfWeek === day.id)
                            .map((lesson) => (
                                <div key={lesson._id} className="lesson-card">
                                    <strong>{lesson.subject} [{lesson.lessonType}]</strong>
                                    <br />
                                    <span className="Lesson_info_teach">
                                        {lesson.teacher ? (
                                            <>
                                                {lesson.teacher.lastName} {lesson.teacher.firstName ? lesson.teacher.firstName.charAt(0) + "." : ""} {lesson.teacher.middleName ? lesson.teacher.middleName.charAt(0) + "." : ""}
                                            </>
                                        ) : (
                                            "Викладач не вказаний"
                                        )}
                                    </span>
                                    <br />
                                    <strong className="Lesson_info_about">{lesson.period?.startTime} - {lesson.period?.endTime}</strong>
                                    <br />
                                    <strong className="Lesson_info_about">{lesson.room ? lesson.room.name : "Не вказано"}</strong>
                                </div>
                            ))}
                        {schedule.filter((lesson) => lesson.dayOfWeek === day.id).length === 0 && (
                            <div className="lesson-card">
                                <p>Немає пар</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentSchedule;
