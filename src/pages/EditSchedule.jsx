import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import EditLessonModal from "../components/EditLessonModal";
import "../styles/StudentSchedule.css";

const EditSchedule = () => {
  const [specialties, setSpecialties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weekDays = [
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "Пʼятниця",
    "Субота",
  ];

  const { startOfWeek, endOfWeek } = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay() === 0 ? 7 : today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - currentDay + 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 5);
    end.setHours(23, 59, 59, 999);

    return { startOfWeek: start, endOfWeek: end };
  }, []);

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

  const lessonTypeAbbreviations = {
    "Практика": "Пр",
    "Лекція": "Лк",
    "Лабораторна": "Лб",
    "Іспит": "Екз",
    "Навчальна практика": "НП",
    "Виїздна практика": "ВП"
  };


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

  const handleGroupChange = async (e) => {
    const groupId = e.target.value;
    setSelectedGroup(groupId);

    if (!groupId) return;

    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/schedule/${groupId}`);
      const filteredSchedule = response.data.filter((lesson) => {
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

  const handleDeleteLesson = async (lessonId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/schedule/${lessonId}`);
      setSchedule(schedule.filter((lesson) => lesson._id !== lessonId));
      alert("Пара видалена");
    } catch (error) {
      alert("Помилка при видаленні пари");
    }
  };

  const handleEditClick = (lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleSaveEdit = (updatedLesson) => {
    setSchedule(prev => 
      prev.map(lesson => 
        lesson._id === updatedLesson._id 
          ? { ...lesson, ...updatedLesson } 
          : lesson
      )
    );
    
    // Опционально: повторная загрузка расписания для актуальности данных
    if (selectedGroup) {
      axios.get(`${process.env.REACT_APP_API_URL}/schedule/${selectedGroup}`)
        .then(response => {
          const filteredSchedule = response.data.filter(lesson => {
            const lessonDate = new Date(lesson.date);
            return lessonDate >= startOfWeek && lessonDate <= endOfWeek;
          });
          setSchedule(filteredSchedule);
        })
        .catch(error => console.error("Ошибка обновления:", error));
    }
  };

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
        <select value={selectedGroup} onChange={handleGroupChange} className="ValueUniversityInfo_Groups">
          <option value="">Оберіть Групу</option>
          {groups.map((group) => (
            <option key={group._id} value={group._id}>{group.name}</option>
          ))}
        </select>
      </div>
      <div className="schedule-container">
        {weekDays.map((day, index) => (
          <div key={index} className="day-column">
            <span className="day_Name">{day}</span>
            {schedule.filter((lesson) => new Date(lesson.date).getDay() === index + 1).map((lesson) => (
              <div key={lesson._id} className="lesson-card">
                <strong>{lesson.subject} <span className="lesson-type">
                    [{lessonTypeAbbreviations[lesson.lessonType] || lesson.lessonType}]
                  </span></strong>
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
                <br />
                <button onClick={() => handleEditClick(lesson)}>Редагувати</button>
                <button onClick={() => handleDeleteLesson(lesson._id)}>Видалити</button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <EditLessonModal 
            lesson={selectedLesson}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveEdit}
        />
    )}
    </div>
  );
};

export default EditSchedule;
