import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CreatePeriod.css";
import Delete from "../assets/svg/Remove.svg";

const ManagePeriods = () => {
    const [name, setName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [periods, setPeriods] = useState([]);
    const [searchQuery] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPeriods = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const apiUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${apiUrl}/api/periods`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPeriods(response.data);
            } catch (error) {
                console.error("Ошибка загрузки временных интервалов", error);
                setError("Не удалось загрузить список временных интервалов");
            } finally {
                setLoading(false);
            }
        };
        fetchPeriods();
    }, []);

    const handleCreatePeriod = async (e) => {
        e.preventDefault();
        if (!name.trim() || !startTime || !endTime) return;
        setLoading(true);
        setError("");
    
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(
                `${apiUrl}/api/periods`,
                { name, startTime, endTime },
                { headers: { Authorization: `Bearer ${token}` }}
            );
    
            setPeriods([...periods, response.data]);
            setName("");
            setStartTime("");
            setEndTime("");
        } catch (error) {
            console.error("Ошибка создания временного интервала:", error);
            setError("Ошибка при создании временного интервала");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePeriod = async (periodId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_API_URL;
            await axios.delete(`${apiUrl}/api/periods/${periodId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPeriods(periods.filter(period => period._id !== periodId));
        } catch (error) {
            console.error("Ошибка удаления временного интервала:", error);
            setError("Ошибка при удалении временного интервала");
        } finally {
            setLoading(false);
        }
    };

    const filteredPeriods = periods.filter(period => 
        period.name && period.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="MainCabinets">
            <div className="CabinetsTextDashboard">
                <p className="text">Тривалість пар</p>
            </div>
            
            <div className="ContainerForAddAndSearch">
                <form onSubmit={handleCreatePeriod} className="ContainerForAdd">
                    <input
                        type="text"
                        placeholder="Назва (Напр. 1 пара)"
                        value={name}
                        className="InputForAddCabinets"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="time"
                        value={startTime}
                        className="InputForAddCabinets"
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                    <input
                        type="time"
                        value={endTime}
                        className="InputForAddCabinets"
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                    <button type="submit" className="SubmitCabinets">
                        Додати
                    </button>
                </form>
            </div>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Загрузка...</p>
            ) : filteredPeriods.length > 0 ? (
                <div className="specialties-list">
                    {filteredPeriods.map(period => (
                        <div key={period._id} className="Cabinet">
                            <div className="Text_for_Periods">
                            <span className="Period_Name">{period.name}</span>
                            <span className="Period_Time">{period.startTime} - {period.endTime}</span>
                            </div>
                            <div className="ButtonForSpeciality">
                                <div className="DeleteRooms" onClick={() => handleDeletePeriod(period._id)}>
                                    <img src={Delete} alt="Remove" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Не існує тривалості пар.</p>
            )}
        </div>
    );
};

export default ManagePeriods;