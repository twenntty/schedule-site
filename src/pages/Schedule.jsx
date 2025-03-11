import React, { useState, useEffect } from "react";
import axios from "axios";
import LOGO from "../assets/svg/LogoForAuth.svg";
import "../styles/Schedule.css";

const Home = () => {
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
        { id: 1, name: "Понедельник" },
        { id: 2, name: "Вторник" },
        { id: 3, name: "Среда" },
        { id: 4, name: "Четверг" },
        { id: 5, name: "Пятница" },
        { id: 6, name: "Суббота" },
    ];

    const getDayOfWeek = (dayOfWeek) => {
        const day = weekDays.find(day => day.id === dayOfWeek);
        return day ? day.name : "Неизвестно";
    };

    useEffect(() => {
        const fetchSpecialties = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/specialties`);
                setSpecialties(response.data);
            } catch (error) {
                setError("Ошибка загрузки специальностей");
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
        } catch (error) {
            setError("Ошибка загрузки курсов");
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = async (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        setSelectedGroup("");
        setSchedule([]);

        if (!courseId) {
            setGroups([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/groups/${courseId}`);
            setGroups(response.data);
        } catch (error) {
            setError("Ошибка загрузки групп");
        } finally {
            setLoading(false);
        }
    };

    const handleGroupChange = async (e) => {
        const groupId = e.target.value;
        setSelectedGroup(groupId);

        if (!groupId) {
            setSchedule([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/schedule/${groupId}`);
            setSchedule(response.data);
        } catch (error) {
            setError("Ошибка загрузки расписания");
        } finally {
            setLoading(false);
        }
    };

    const getLessonTypeAbbreviation = (lessonType) => {
        const abbreviations = {
            "Лекция": "[Лк]",
            "Практика": "[Пр]",
            "Лабораторная": "[Лаб]",
            "Экзамен": "[Экз]",
            "Учебная практика": "[УП]",
            "Выездная практика": "[ВП]"
        };
        return abbreviations[lessonType] || "";
    };

    return (
        <div>
            <div className="HeaderForSchedule">
                <div className="logoForSchedule">
                    <img src={LOGO} alt="Logo" className="LogoImgForSchedule" />
                </div>
                <div className="main_header_for_schedule">
                    <div className="navbarForSchedule">
                        <div className="textForSchedule">
                            <p className="ScheduleNav">Розклад занять</p>
                            <p className="ScheduleNav">Розклад для викладачів</p>
                        </div>

                        <div className="ValueForSchedule">
                            <select
                                value={selectedSpecialty}
                                onChange={handleSpecialtyChange}
                                className="ValueUniversityInfo_Spec"
                            >
                                <option value="">Оберіть Спеціальність</option>
                                {specialties.map((spec) => (
                                    <option key={spec._id} value={spec._id}>
                                        {spec.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedCourse}
                                onChange={handleCourseChange}
                                disabled={!selectedSpecialty}
                                className="ValueUniversityInfo_Course"
                            >
                                <option value="">Курс</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedGroup}
                                onChange={handleGroupChange}
                                disabled={!selectedCourse}
                                className="ValueUniversityInfo_Groups"
                            >
                                <option value="">Групу</option>
                                {groups.map((group) => (
                                    <option key={group._id} value={group._id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <h3>Расписание:</h3>
            {schedule.length === 0 ? (
                <p>Нет занятий</p>
            ) : (
                <ul>
                    {schedule.map((lesson) => (
                        <li key={lesson._id}>
                            <strong>{lesson.subject} {getLessonTypeAbbreviation(lesson.lessonType)}</strong>
                            <br />
                            <strong>{lesson.teacher}</strong>
                            <br />
                            {lesson.period && lesson.period.startTime} - {lesson.period && lesson.period.endTime}
                            <br />
                            <strong>Кабинет:</strong> {lesson.room ? lesson.room.name : "Не указан"}
                            <br />
                            <strong>День недели:</strong> {lesson.dayOfWeek ? getDayOfWeek(lesson.dayOfWeek) : "Не указан"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Home;
