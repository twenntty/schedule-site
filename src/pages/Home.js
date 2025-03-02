import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
    const [specialties, setSpecialties] = useState([]);
    const [courses, setCourses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [schedule, setSchedule] = useState([]);
    
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");

    // Загружаем специальности при загрузке страницы
    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await axios.get("/specialties");
                setSpecialties(response.data);
            } catch (error) {
                console.error("Ошибка загрузки специальностей:", error);
            }
        };
        fetchSpecialties();
    }, []);

    // Загружаем курсы после выбора специальности
    const handleSpecialtyChange = async (e) => {
        const specialtyId = e.target.value;
        setSelectedSpecialty(specialtyId);
        setSelectedCourse(""); // Сбрасываем курс
        setSelectedGroup(""); // Сбрасываем группу
        setGroups([]);
        setSchedule([]);

        if (!specialtyId) {
            setCourses([]);
            return;
        }

        try {
            const response = await axios.get(`/courses/${specialtyId}`);
            setCourses(response.data);
        } catch (error) {
            console.error("Ошибка загрузки курсов:", error);
        }
    };

    // Загружаем группы после выбора курса
    const handleCourseChange = async (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        setSelectedGroup(""); // Сбрасываем группу
        setSchedule([]);

        if (!courseId) {
            setGroups([]);
            return;
        }

        try {
            const response = await axios.get(`/groups/${courseId}`);
            setGroups(response.data);
        } catch (error) {
            console.error("Ошибка загрузки групп:", error);
        }
    };

    // Загружаем расписание после выбора группы
    const handleGroupChange = async (e) => {
        const groupId = e.target.value;
        setSelectedGroup(groupId);

        if (!groupId) {
            setSchedule([]);
            return;
        }

        try {
            const response = await axios.get(`/schedule/${groupId}`);
            setSchedule(response.data);
        } catch (error) {
            console.error("Ошибка загрузки расписания:", error);
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
            <h2>Выберите параметры</h2>

            {/* Выбор специальности */}
            <label>Специальность:</label>
            <select value={selectedSpecialty} onChange={handleSpecialtyChange}>
                <option value="">Выберите специальность</option>
                {specialties.map((spec) => (
                    <option key={spec._id} value={spec._id}>
                        {spec.name}
                    </option>
                ))}
            </select>

            {/* Выбор курса */}
            <label>Курс:</label>
            <select value={selectedCourse} onChange={handleCourseChange} disabled={!selectedSpecialty}>
                <option value="">Выберите курс</option>
                {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                        {course.name}
                    </option>
                ))}
            </select>

            {/* Выбор группы */}
            <label>Группа:</label>
            <select value={selectedGroup} onChange={handleGroupChange} disabled={!selectedCourse}>
                <option value="">Выберите группу</option>
                {groups.map((group) => (
                    <option key={group._id} value={group._id}>
                        {group.name}
                    </option>
                ))}
            </select>


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
                            {lesson.period.startTime} - {lesson.period.endTime}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Home;
