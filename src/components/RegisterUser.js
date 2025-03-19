import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        patronymic: "",
        position: "",
        educationalInstitution: "",
        phoneNumber: "",
        email: "",
        password: "",
        role: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const apiUrl = `${process.env.REACT_APP_API_URL}/auth/register`;
            
            await axios.post(
                apiUrl,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            alert("Користувача успішно зареєстровано!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Помилка реєстрації:", error);
            alert(error.response?.data?.message || "Помилка при реєстрації");
        }
    };

    return (
        <div className="registration-form">
            <h2>Реєстрація нового користувача</h2>
            <form onSubmit={handleRegister}>
                {/* Основные поля */}
                <div className="form-row">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Ім'я"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Прізвище"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="patronymic"
                        placeholder="По батькові (необов'язково)"
                        value={formData.patronymic}
                        onChange={handleChange}
                    />
                </div>

                {/* Контактная информация */}
                <div className="form-row">
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Номер телефону (+380XXXXXXXXX)"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        pattern="\+380\d{9}"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Електронна пошта"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Профессиональная информация */}
                <div className="form-row">
                    <input
                        type="text"
                        name="educationalInstitution"
                        placeholder="Навчальний заклад"
                        value={formData.educationalInstitution}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="position"
                        placeholder="Посада"
                        value={formData.position}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Пароль и роль */}
                <div className="form-row">
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <select 
                        name="role" 
                        value={formData.role} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Оберіть роль</option>
                        <option value="admin">Адміністратор</option>
                        <option value="institution">Представник закладу</option>
                        <option value="user">Користувач</option>
                    </select>
                </div>

                <button type="submit" className="submit-button">
                    Зареєструвати
                </button>
            </form>
        </div>
    );
};

export default RegisterUser;