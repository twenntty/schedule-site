import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateRoom = () => {
    const [name, setName] = useState("");
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(""); // Error state to manage error messages
    const [loading, setLoading] = useState(false); // Loading state to manage request loading

    // ✅ Загружаем список кабинетов
    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true); // Start loading
            try {
                const token = localStorage.getItem("token");
                const apiUrl = process.env.REACT_APP_API_URL || "/api"; // Use the environment variable for API
                const response = await axios.get(`${apiUrl}/rooms`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRooms(response.data);
            } catch (error) {
                console.error("Ошибка загрузки кабинетов:", error);
                setError("Ошибка при загрузке кабинетов. Попробуйте позже.");
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchRooms();
    }, []);

    // ✅ Функция создания кабинета
    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        setError(""); // Reset error state
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL || "/api"; // Use the environment variable for API
            const response = await axios.post(
                `${apiUrl}/rooms`,
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setRooms([...rooms, response.data]); // Добавляем новый кабинет в список
            setName("");
        } catch (error) {
            console.error("Ошибка при создании кабинета", error);
            setError("Ошибка при добавлении кабинета. Попробуйте позже.");
        } finally {
            setLoading(false); // End loading
        }
    };

    // ✅ Функция удаления кабинета
    const handleDeleteRoom = async (roomId) => {
        setLoading(true); // Start loading
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL || "/api"; // Use the environment variable for API
            await axios.delete(`${apiUrl}/rooms/${roomId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRooms(rooms.filter(room => room._id !== roomId)); // Удаляем кабинет из списка
        } catch (error) {
            console.error("Ошибка при удалении кабинета:", error);
            setError("Ошибка при удалении кабинета. Попробуйте позже.");
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div>
            <h2>Создать кабинет</h2>
            {error && <div style={{ color: "red" }}>{error}</div>} {/* Display error if there's any */}
            <form onSubmit={handleCreateRoom}>
                <input
                    type="text"
                    placeholder="Номер кабинета"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Добавление..." : "Добавить"}
                </button>
            </form>

            {/* ✅ Вывод списка кабинетов */}
            <h3>Список кабинетов:</h3>
            {loading ? (
                <p>Загружается...</p>
            ) : rooms.length > 0 ? (
                <ul>
                    {rooms.map((room) => (
                        <li key={room._id}>
                            {room.name}
                            <button
                                onClick={() => handleDeleteRoom(room._id)}
                                style={{
                                    marginLeft: "10px",
                                    background: "red",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                ❌ Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет доступных кабинетов.</p>
            )}
        </div>
    );
};

export default CreateRoom;
