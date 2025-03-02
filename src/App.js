import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./routes";

const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard"); // Если токен есть, сразу на dashboard
        }
    }, [navigate]);

    return <AppRoutes />;
};

export default App;