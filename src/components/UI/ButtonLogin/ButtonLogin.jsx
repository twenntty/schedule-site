import React from "react";
import { useNavigate } from "react-router-dom";
import "./ButtonLogin.css";

const ButtonLogin = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/auth");
    };

    return (
        <button className="button_login" onClick={handleLoginClick}>
            Увійти до Sched
        </button>
    );
};

export default ButtonLogin;
