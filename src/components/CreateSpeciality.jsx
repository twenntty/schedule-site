import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManageSpecialties.css";
import Delete from "../assets/svg/Remove.svg";
import Search from "../assets/svg/Search.svg";

const ManageSpecialties = () => {
    const [name, setName] = useState("");
    const [specialties, setSpecialties] = useState([]);
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSpecialties = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const apiUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${apiUrl}/specialties`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSpecialties(response.data);
            } catch (error) {
                console.error("Ошибка загрузки специальностей", error);
                setError("Не удалось загрузить список специальностей");
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialties();
    }, []);

    const handleCreateSpecialty = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        setError("");
    
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(
                `${apiUrl}/specialties`,
                { name },
                { headers: { Authorization: `Bearer ${token}` }}
            );
    
            setSpecialties([...specialties, response.data]);
            setName("");
        } catch (error) {
            console.error("Ошибка создания специальности:", error);
            setError("Ошибка при создании специальности");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSpecialty = async (specialtyId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL;
            await axios.delete(`${apiUrl}/specialties/${specialtyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSpecialties(specialties.filter(spec => spec._id !== specialtyId));
        } catch (error) {
            console.error("Ошибка удаления специальности:", error);
            setError("Ошибка при удалении специальности");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setSearchQuery(search);
    };

    const filteredSpecialties = specialties.filter(spec => 
        spec.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="MainCabinets">
            <div className="CabinetsTextDashboard">
                <p className="text">Спеціальності</p>
            </div>
            
            <div className="ContainerForAddAndSearch">
                <div className="SearchContainer">
                    <input
                        type="text"
                        placeholder="Пошук спеціальностей"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="InputSerchCabinet"
                    />
                    <div className="handleSearch">
                        <img src={Search} alt="Search" onClick={handleSearch} />
                    </div>
                </div>

                <form onSubmit={handleCreateSpecialty} className="ContainerForAdd">
                    <input
                        type="text"
                        placeholder="Назва спеціальності"
                        value={name}
                        className="InputForAddCabinets"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <button type="submit" className="SubmitCabinets">
                        Додати спеціальність
                    </button>
                </form>
            </div>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Завантаження...</p>
            ) : filteredSpecialties.length > 0 ? (
                <div className="specialties-list">
                    {filteredSpecialties.map(spec => (
                        <div 
                            key={spec._id} 
                            className="Cabinet"
                        >
                            <span>{spec.name}</span>
                            <div className="ButtonForSpeciality">
                                <div className="DeleteRooms" onClick={() => handleDeleteSpecialty(spec._id)} >
                                    <img src={Delete} alt="Remove" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>В базі немає спеціальностей</p>
            )}
        </div>
    );
};

export default ManageSpecialties;