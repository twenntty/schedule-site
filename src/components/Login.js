import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeaderForAuth from "../Widget/HeaderForAuth/HeaderForAuth";
import "../styles/Auth.css";
import ImgForAuth from "../assets/svg/GirlWithLaptop.svg";
import FooterForAuth from "../Widget/FooterForAuth/FooterForAuth";

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "SchedGo - Вхід";
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError("Ошибка входа");
        }
    };

    return (
        <div className="auth-container">
            <HeaderForAuth />
            <div className="Form_For_Auth">
                <div className="Auth_Form">
                    <div className="Text_Form">
                        <h2 className="WelcomTextAuth">Ласкаво просимо!</h2>
                        <h3 className="SadTextAuth">З поверненням, ми сумували 😿</h3>
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <form onSubmit={handleLogin} className="Form_SignIn">
                        <div className="InputCss">
                            <label htmlFor="username" className="LabelCssForm">Email:</label>
                            <input
                                type="email"
                                id="username"
                                placeholder="Email"
                                className="Form_input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="InputCss">
                            <label htmlFor="password" className="LabelCssForm">Пароль:</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Пароль"
                                className="Form_input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="Form_button">Увійти до Sched</button>
                    </form>
                </div>
                <div className="ImgForAuth">
                    <img src={ImgForAuth} alt="GirlWithLaptop" className="ImgForAuth" />
                </div>
            </div>
            <FooterForAuth />
        </div>
    );
};

export default Login;
