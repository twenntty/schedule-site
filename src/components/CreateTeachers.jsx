import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CreateTeacher.css";
import "../styles/CreateRoom.css";
import Delete from "../assets/svg/Remove.svg";
import Search from "../assets/svg/Search.svg";
import EditTeacherModal from "./EditTeacherModal";

const CreateTeachers = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [invite, setInvite] = useState("");
    const [creds, setCreds] = useState(null); // { login, password } after adding
    const [copied, setCopied] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/teachers`);
                setTeachers(response.data);
            } catch (error) {
                console.error("Помилка загрузки викладачів", error);
                setError("Неможу знайти викладачів, спробуйте пізніше :(");
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();

        // Invite link for teacher self-registration.
        axios.get(`${apiUrl}/institutions/me`).then((res) => {
            const { slug, registrationToken } = res.data;
            setInvite(`${window.location.origin}/register/${slug}/teacher?id=${registrationToken}`);
        }).catch(() => {});
    }, [apiUrl]);

    const copyInvite = async () => {
        try { await navigator.clipboard.writeText(invite); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
    };

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim() || !middleName.trim()) return;
        setLoading(true);
        setError("");
    
        try {
            const response = await axios.post(`${apiUrl}/teachers`, { firstName, lastName, middleName });
            setTeachers([...teachers, response.data.teacher]);
            setCreds(response.data.account); // { login, password } — shown once
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

            {invite && (
                <div className="invite-card">
                    <div className="invite-card__text">
                        <p className="invite-card__title">Посилання для реєстрації викладачів</p>
                        <p className="invite-card__link">{invite}</p>
                    </div>
                    <button type="button" className="invite-card__btn" onClick={copyInvite}>
                        {copied ? "Скопійовано ✓" : "Копіювати"}
                    </button>
                </div>
            )}

            {creds && (
                <div className="creds-card">
                    <div>
                        <p className="creds-card__title">Акаунт викладача створено</p>
                        <p className="creds-card__row">Логін: <b>{creds.login}</b></p>
                        <p className="creds-card__row">Пароль: <b>{creds.password}</b></p>
                        <p className="creds-card__hint">Передайте ці дані викладачу — пароль більше не показуватиметься.</p>
                    </div>
                    <button type="button" className="creds-card__close" onClick={() => setCreds(null)}>✕</button>
                </div>
            )}

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
                                <div className="EditRooms teacher-edit-btn" onClick={() => setEditingTeacher(teacher)} title="Редагувати">✎</div>
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

            {editingTeacher && (
                <EditTeacherModal
                    teacher={editingTeacher}
                    onClose={() => setEditingTeacher(null)}
                    onSave={(updated) => setTeachers(teachers.map((t) => (t._id === updated._id ? updated : t)))}
                />
            )}
        </div>
    );
};

export default CreateTeachers;