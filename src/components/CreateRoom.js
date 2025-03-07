import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateRoom = () => {
    const [name, setName] = useState("");
    const [rooms, setRooms] = useState([]);

    // ✅ Загружаем список кабинетов
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("/api/rooms", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRooms(response.data);
            } catch (error) {
                console.error("Ошибка загрузки кабинетов:", error);
            }
        };

        fetchRooms();
    }, []);

    // ✅ Функция создания кабинета
    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("/api/rooms", { name }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRooms([...rooms, response.data]); // Добавляем новый кабинет в список
            setName("");
        } catch (error) {
            console.error("Ошибка при создании кабинета", error);
        }
    };

    // ✅ Функция удаления кабинета
    const handleDeleteRoom = async (roomId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/rooms/${roomId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRooms(rooms.filter(room => room._id !== roomId)); // Удаляем кабинет из списка
        } catch (error) {
            console.error("Ошибка при удалении кабинета:", error);
        }
    };

    return (
        <div>
            <h2>Создать кабинет</h2>
            <form onSubmit={handleCreateRoom}>
                <input type="text" placeholder="Номер кабинета" value={name} onChange={(e) => setName(e.target.value)} required />
                <button type="submit">Добавить</button>
            </form>

            {/* ✅ Вывод списка кабинетов */}
            <h3>Список кабинетов:</h3>
            {rooms.length > 0 ? (
                <ul>
                    {rooms.map(room => (
                        <li key={room._id}>
                            {room.name}
                            <button onClick={() => handleDeleteRoom(room._id)} style={{ marginLeft: "10px", background: "red", color: "white", border: "none", cursor: "pointer" }}>
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
