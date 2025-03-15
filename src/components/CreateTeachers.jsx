import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CreateTeacher.css";
import Delete from "../assets/svg/Remove.svg";
import Search from "../assets/svg/Search.svg";

const CreateTeachers = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const apiUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${apiUrl}/teachers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTeachers(response.data);
            } catch (error) {
                console.error("Помилка загрузки викладачів", error);
                setError("Неможу знайти викладачів, спробуйте пізніше :(");
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim() || !middleName.trim()) return;
        setLoading(true);
        setError("");
    
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(
                `${apiUrl}/teachers`,
                { firstName, lastName, middleName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            setTeachers([...teachers, response.data]);
            setFirstName("");
            setLastName("");
            setMiddleName("");
        } catch (error) {
            console.error("Помилка створення викладача", error);
            setError("Помилка створення викладача");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTeacher = async (teacherId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL;
            await axios.delete(`${apiUrl}/teachers/${teacherId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTeachers(teachers.filter(teacher => teacher._id !== teacherId));
        } catch (error) {
            console.error("Помилка видалення викладача", error);
            setError("Помилка видалення викладача");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setSearchQuery(search);
    };

    const filteredTeachers = teachers.filter(teacher => 
        teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="MainCabinets">
            <div className="CabinetsTextDashboard">
                <p className="text">Викладачі</p>
            </div>
            
            <div className="ContainerForAddAndSerchTeachers">
                <div className="SearchContainerTeachers">
                    <input
                        type="text"
                        placeholder="Пошук викладачів"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="InputSerchCabinet"
                    />
                    <div className="handleSearch">
                        <img src={Search} alt="Search" onClick={handleSearch} />
                    </div>
                </div>

                <form onSubmit={handleCreateTeacher} className="ContainerForAddTeachers">
                    <input
                        type="text"
                        placeholder="Прізвище"
                        value={lastName}
                        className="InputForAddCabinets"
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Ім'я"
                        value={firstName}
                        className="InputForAddCabinets"
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="По батькові"
                        value={middleName}
                        className="InputForAddCabinets"
                        onChange={(e) => setMiddleName(e.target.value)}
                        required
                    />
                    <button type="submit" className="SubmitCabinets">
                        Додати викладача
                    </button>
                </form>
            </div>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Завантаження...</p>
            ) : filteredTeachers.length > 0 ? (
                <div className="teacher-list">
                    {filteredTeachers.map((teacher) => (
                        <div 
                            key={teacher._id} 
                            className="Cabinet"
                        >
                            <div className="Teachers-FullName">
                            <span className="Teachers-Name">{teacher.lastName}</span>
                            <span className="Teachers-Name">{teacher.firstName}</span>
                            <span className="Teachers-Name">{teacher.middleName}</span>
                            </div>
                            <div className="ButtonForCabinets">
                                <div className="DeleteRooms" onClick={() => handleDeleteTeacher(teacher._id)} >
                                    <img src={Delete} alt="Remove" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>В базі немає викладачів</p>
            )}
        </div>
    );
};

export default CreateTeachers;