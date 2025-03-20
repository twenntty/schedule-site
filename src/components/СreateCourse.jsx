import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManageCourses.css";
import "../styles/CreateRoom.css";
import Delete from "../assets/svg/Remove.svg";
import Search from "../assets/svg/Search.svg";

const ManageCourses = () => {
    const [name, setName] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [specialties, setSpecialties] = useState([]);
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const apiUrl = process.env.REACT_APP_API_URL;

                const [specialtiesResponse, coursesResponse] = await Promise.all([
                    axios.get(`${apiUrl}/specialties`,),
                    axios.get(`${apiUrl}/courses`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setSpecialties(specialtiesResponse.data);
                setCourses(coursesResponse.data);
            } catch (error) {
                console.error("Помилка загрузки курсів.", error);
                setError("Помилка загрузки курсів.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        if (!name.trim() || !selectedSpecialty) return;
        setLoading(true);
        setError("");
    
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(
                `${apiUrl}/courses`,
                { name, specialty: selectedSpecialty },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            setCourses([...courses, response.data]);
            setName("");
        } catch (error) {
            console.error("Помилка створення курсу.", error);
            setError("Помилка створення курсу.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL;
            await axios.delete(`${apiUrl}/courses/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCourses(courses.filter((course) => course._id !== courseId));
        } catch (error) {
            console.error("Помилка видаленню курсу.", error);
            setError("Помилка видаленню курсу.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setSearchQuery(search);
    };

    const filteredCourses = courses.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getSpecialtyName = (id) => {
        const specialty = specialties.find((spec) => spec._id === id);
        return specialty ? specialty.name : "Невідома спеціальність";
    };

    return (
        <div className="MainCabinets">
            <div className="CabinetsTextDashboard">
                <p className="text">Курси</p>
            </div>
            
            <div className="ContainerForAddAndSearchCourse">
                <div className="SearchContainerCourse">
                    <input
                        type="text"
                        placeholder="Пошук курсів"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="InputSerchCabinet"
                    />
                    <div className="handleSearch">
                        <img src={Search} alt="Search" onClick={handleSearch} />
                    </div>
                </div>

                <form onSubmit={handleCreateCourse} className="ContainerForAdd">
                    <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="InputForAddCabinets"
                        required
                    >
                        <option value="">Оберіть спеціальність</option>
                        {specialties.map((spec) => (
                            <option key={spec._id} value={spec._id}>
                                {spec.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Назва курсу"
                        value={name}
                        className="InputForAddCabinets"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <button type="submit" className="SubmitCabinets">
                        Додати курс
                    </button>
                </form>
            </div>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Завантаження...</p>
            ) : filteredCourses.length > 0 ? (
                <div className="courses-list">
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="Cabinet">
                            <div className="text_For_Course">
                                <span className="Course_Name">{getSpecialtyName(course.specialty)}</span>
                                <span className="Course_id">{course.name}</span>
                            </div>
                            <div className="ButtonForCourse">
                                <div className="DeleteRooms" onClick={() => handleDeleteCourse(course._id)}>
                                    <img src={Delete} alt="Remove" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>В базі немає курсів</p>
            )}
        </div>
    );
};

export default ManageCourses;
