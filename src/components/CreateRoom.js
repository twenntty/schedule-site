import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CreateRoom.css";
import Delete from "../assets/svg/Remove.svg";
import Search from "../assets/svg/Search.svg";

const CreateRoom = () => {
    const [name, setName] = useState("");
    const [rooms, setRooms] = useState([]);
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const apiUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${apiUrl}/api/rooms`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRooms(response.data);
            } catch (error) {
                console.error("Не можу зʼєднатися з базою аудиторій", error);
                setError("Не можу зʼєднатися з базою аудиторій. Спробуйте пізніше.");
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleCreateRoom = async () => {
        if (!name.trim()) return;
        setLoading(true);
        setError("");
    
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(
                `${apiUrl}/api/rooms`,
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            setRooms([...rooms, response.data]);
            setName("");
        } catch (error) {
            console.error("Помилка при створенні аудиторії:", error);
            setError("Помилка при створенні аудиторії. Спробуйте пізніше.");
        } finally {
            setLoading(false);
        }
    };
    

    const handleDeleteRoom = async (roomId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL;
            await axios.delete(`${apiUrl}/api/rooms/${roomId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRooms(rooms.filter(room => room._id !== roomId));
        } catch (error) {
            console.error("Помилка при видаленні аудиторії:", error);
            setError("Помилка при видаленні аудиторії. Спробуйте пізніше.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setSearchQuery(search);
    };

    const filteredRooms = rooms.filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="MainCabinets">
            <div className="CabinetsTextDashboard">
                <p className="text">Аудиторії</p>
            </div>
            
            <div className="ContainerForAddAndSearch">

                <div className="SearchContainer">
                    <input
                        type="text"
                        placeholder="Пошук аудиторії"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="InputSerchCabinet"
                    />
                    <div className="handleSearch">
                        <img src={Search} alt="Search" onClick={handleSearch} />
                    </div>
                </div>

                <form onSubmit={handleCreateRoom} className="ContainerForAdd">
                    <input
                        type="text"
                        placeholder="Номер аудиторії"
                        value={name}
                        className="InputForAddCabinets"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <div className="SubmitCabinets" onClick={handleCreateRoom}>Додати аудиторію</div>
                </form>
            </div>

            {loading ? (
                <p>Загрузка...</p>
            ) : filteredRooms.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                    {filteredRooms.map((room) => (
                        <div 
                            key={room._id} 
                            className="Cabinet"
                        >
                            <span>{room.name}</span>
                            <div className="ButtonForCabinets">
                                <div className="DeleteRooms" onClick={() => handleDeleteRoom(room._id)} >
                                    <img src={Delete} alt="Remove" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>В базі не існує кабінетів.</p>
            )}
        </div>
    );
};

export default CreateRoom;