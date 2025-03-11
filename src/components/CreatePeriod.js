import React, { useState, useEffect } from "react";
import axios from "axios";

const CreatePeriod = () => {
    const [name, setName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [periods, setPeriods] = useState([]);
    const [error, setError] = useState("");  // State to handle errors
    const [loading, setLoading] = useState(false);  // State for loading

    // ✅ Загружаем список актуальных временных интервалов
    useEffect(() => {
        const fetchPeriods = async () => {
            setLoading(true);  // Start loading
            try {
                const token = localStorage.getItem("token");
                const apiUrl = process.env.REACT_APP_API_URL || "/api";  // Use the env variable
                const response = await axios.get(`${apiUrl}/periods`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPeriods(response.data);
            } catch (error) {
                console.error("Ошибка загрузки времени пар:", error);
                setError("Ошибка при загрузке данных. Пожалуйста, попробуйте позже.");
            } finally {
                setLoading(false);  // End loading
            }
        };

        fetchPeriods();
    }, []);

    // ✅ Функция добавления нового времени пары
    const handleCreatePeriod = async (e) => {
        e.preventDefault();
        setLoading(true);  // Start loading
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL || "/api";  // Use the env variable
            const response = await axios.post(
                `${apiUrl}/periods`, 
                { name, startTime, endTime }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPeriods([...periods, response.data]); // Добавляем в список
            setName("");
            setStartTime("");
            setEndTime("");
        } catch (error) {
            console.error("Ошибка при добавлении времени пары", error);
            setError("Ошибка при добавлении временного интервала. Пожалуйста, попробуйте позже.");
        } finally {
            setLoading(false);  // End loading
        }
    };

    return (
        <div>
            <h2>Добавить время пары</h2>
            {error && <div style={{ color: "red" }}>{error}</div>}  {/* Show error message */}

            <form onSubmit={handleCreatePeriod}>
                <input
                    type="text"
                    placeholder="Название (Напр. 1 пара)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Добавление..." : "Добавить"}
                </button>
            </form>

            {/* ✅ Вывод списка временных интервалов */}
            <h3>Актуальные временные интервалы:</h3>
            {periods.length > 0 ? (
                <ul>
                    {periods.map((period) => (
                        <li key={period._id}>
                            {period.name}: {period.startTime} - {period.endTime}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет доступных временных интервалов.</p>
            )}
        </div>
    );
};

export default CreatePeriod;
