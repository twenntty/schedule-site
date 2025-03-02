import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Загружаем данные о пользователе
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                console.error("Ошибка загрузки данных пользователя:", error);
            }
        };

        fetchUserData();
    }, []);

    // ✅ Функция выхода
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div>
            <h2>Личный кабинет</h2>

            {/* ✅ Вывод информации о пользователе */}
            {user && (
                <div>
                    <p><strong>ПІБ:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Должность:</strong> {user.position}</p>
                    <p><strong>Роль:</strong> {user.role}</p>
                </div>
            )}

            {/* ✅ Кнопка выхода */}
            <button onClick={handleLogout} style={{ background: "red", color: "white", padding: "10px", border: "none", cursor: "pointer" }}>
                Выйти
            </button>

            {/* ✅ Для ADMIN - управление пользователями */}
            {user?.role === "admin" && (
                <>
                    <h2>Управление пользователями</h2>
                    <Link to="/dashboard/register">
                        <button>➕ Зарегистрировать нового пользователя</button>
                    </Link>
                    <Link to="/dashboard/members">
                        <button>👥 Просмотреть всех пользователей</button>
                    </Link>
                </>
            )}

            {/* ✅ Для INSTITUTION - создание пар */}
            {user?.role === "institution" && (
                <>
                    <h2>Создание пары</h2>
                    <Link to="/dashboard/createlesson">
                        <button>📚 Добавить новую пару</button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default Dashboard;
