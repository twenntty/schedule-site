import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManageGroups.css";
import "../styles/CreateRoom.css";
import Delete from "../assets/svg/Remove.svg";
import Search from "../assets/svg/Search.svg";

const ManageGroups = () => {
    const [name, setName] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [specialties, setSpecialties] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]); // Новый стейт для фильтрованных курсов
    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const apiUrl = process.env.REACT_APP_API_URL;

                const [specialtiesResponse, coursesResponse, groupsResponse] = await Promise.all([
                    axios.get(`${apiUrl}/specialties`),
                    axios.get(`${apiUrl}/courses`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${apiUrl}/api/groups`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                setSpecialties(specialtiesResponse.data);
                setCourses(coursesResponse.data);
                setGroups(groupsResponse.data);
            } catch (error) {
                console.error("Помилка загрузки даних.", error);
                setError("Помилка загрузки даних.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedSpecialty) {
            // Фильтрация курсов по выбранной специальности
            const filtered = courses.filter((course) => course.specialty === selectedSpecialty);
            setFilteredCourses(filtered);
        } else {
            setFilteredCourses(courses); // Если специальность не выбрана, показываем все курсы
        }
    }, [selectedSpecialty, courses]);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!name.trim() || !selectedSpecialty || !selectedCourse) return;
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(
                `${apiUrl}/api/groups`,
                { name, specialty: selectedSpecialty, course: selectedCourse },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setGroups([...groups, response.data.group]);
            setName("");
        } catch (error) {
            console.error("Помилка створення групи.", error);
            setError("Помилка створення групи.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL;
            await axios.delete(`${apiUrl}/api/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setGroups(groups.filter((group) => group._id !== groupId));
        } catch (error) {
            console.error("Помилка видаленню групи.", error);
            setError("Помилка видаленню групи.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setSearchQuery(search);
    };

    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getSpecialtyName = (id) => {
        const specialty = specialties.find((spec) => spec._id === id);
        return specialty ? specialty.name : "Невідома спеціальність";
    };

    const getGroupsName = (id) => {
        const group = groups.find((group) => group._id === id);
        return group ? group.name : "Невідома група";
    };

    return (
        <div className="MainCabinets">
            <div className="CabinetsTextDashboard">
                <p className="text">Групи</p>
            </div>

            <div className="ContainerForAddAndSearchGroups">
                <div className="SearchContainerGroups">
                    <input
                        type="text"
                        placeholder="Пошук груп"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="InputSerchCabinet"
                    />
                    <div className="handleSearch">
                        <img src={Search} alt="Search" onClick={handleSearch} />
                    </div>
                </div>

                <form onSubmit={handleCreateGroup} className="ContainerForAddGroups">
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

                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="InputForAddCabinets"
                        required
                    >
                        <option value="">Оберіть курс</option>
                        {filteredCourses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Назва групи"
                        value={name}
                        className="InputForAddCabinets"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <button type="submit" className="SubmitCabinets">
                        Додати групу
                    </button>
                </form>
            </div>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Завантаження...</p>
            ) : filteredGroups.length > 0 ? (
                <div className="gropus-list">
                    {filteredGroups.map((group) => (
                        <div key={group._id} className="Cabinet">
                            <div className="text_For_Groups">
                                <span className="Groups_Name">
                                    {typeof group.specialty === "object" ? group.specialty.name : getSpecialtyName(group.specialty)}
                                </span>
                                <span className="Groups_course">
                                    {typeof group.specialty === "object" ? group.course.name : getGroupsName(group.course)}
                                </span>
                                <span className="Course_id">{group.name} група</span>
                            </div>
                            <div className="ButtonForCourse">
                                <div className="DeleteRooms" onClick={() => handleDeleteGroup(group._id)}>
                                    <img src={Delete} alt="Remove" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>В базі немає груп</p>
            )}
        </div>
    );
};

export default ManageGroups;
