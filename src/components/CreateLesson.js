import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateLesson = () => {
    const navigate = useNavigate();
    const [specialties, setSpecialties] = useState([]);
    const [courses, setCourses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [periods, setPeriods] = useState([]);

    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [subject, setSubject] = useState("");
    const [teacher, setTeacher] = useState("");
    const [lessonType, setLessonType] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("");

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

    const handleSpecialtyChange = async (e) => {
        const specialtyId = e.target.value;
        setSelectedSpecialty(specialtyId);
        setSelectedCourse("");
        setSelectedGroup("");
        setCourses([]);
        setGroups([]);

        if (!specialtyId) return;

        try {
            const response = await axios.get(`/courses/${specialtyId}`);
            setCourses(response.data);
        } catch (error) {
            console.error("Ошибка загрузки курсов:", error);
        }
    };

    const handleCourseChange = async (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        setSelectedGroup("");
        setGroups([]);

        if (!courseId) return;

        try {
            const response = await axios.get(`/groups/${courseId}`);
            setGroups(response.data);
        } catch (error) {
            console.error("Ошибка загрузки групп:", error);
        }
    };

    useEffect(() => {
        const fetchPeriods = async () => {
            try {
                const response = await axios.get("/periods");
                setPeriods(response.data);
            } catch (error) {
                console.error("Ошибка загрузки времени пар:", error);
            }
        };
        fetchPeriods();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "/schedule",
                { subject, teacher, lessonType, period: selectedPeriod, group: selectedGroup },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Пара успешно добавлена!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Ошибка при добавлении пары:", error);
            alert("Ошибка при добавлении пары");
        }
    };

    return (
        <div>
            <h2>Добавить новую пару</h2>
            <form onSubmit={handleSubmit}>
                <label>Специальность:</label>
                <select value={selectedSpecialty} onChange={handleSpecialtyChange}>
                    <option value="">Выберите специальность</option>
                    {specialties.map((spec) => (
                        <option key={spec._id} value={spec._id}>{spec.name}</option>
                    ))}
                </select>

                <label>Курс:</label>
                <select value={selectedCourse} onChange={handleCourseChange} disabled={!selectedSpecialty}>
                    <option value="">Выберите курс</option>
                    {courses.map((course) => (
                        <option key={course._id} value={course._id}>{course.name}</option>
                    ))}
                </select>

                <label>Группа:</label>
                <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} disabled={!selectedCourse}>
                    <option value="">Выберите группу</option>
                    {groups.map((group) => (
                        <option key={group._id} value={group._id}>{group.name}</option>
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

                <label>Время:</label>
                <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} required>
                    <option value="">Выберите время</option>
                    {periods.map((period) => (
                        <option key={period._id} value={period._id}>{period.startTime} - {period.endTime}</option>
                    ))}
                </select>

                <button type="submit">Добавить пару</button>
            </form>
        </div>
    );
};

export default CreateLesson;
