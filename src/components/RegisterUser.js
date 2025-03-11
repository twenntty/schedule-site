import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [position, setPosition] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const apiUrl = `${process.env.REACT_APP_API_URL}/auth/register`; // Используем переменную окружения
            await axios.post(
                apiUrl,
                { firstName, lastName, position, email, password, role },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Пользователь успешно зарегистрирован!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            alert("Ошибка при регистрации");
        }
    };

    return (
        <div>
            <h2>Регистрация пользователя</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Имя"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Фамилия"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Должность"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="">Выберите роль</option>
                    <option value="admin">Администратор</option>
                    <option value="institution">Представитель учебного заведения</option>
                    <option value="user">Пользователь</option>
                </select>
                <button type="submit">Зарегистрировать</button>
            </form>
        </div>
    );
};

export default RegisterUser;
