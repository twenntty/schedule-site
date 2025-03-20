import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule"
import BodyColorWrapper from "./Widget/BodyColorWrapper/BodyColorWrapper";


const AuthRedirect = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    return children;
};

const AppRoutes = () => {
    return (
        <Router basename="/">
            <BodyColorWrapper>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AuthRedirect><Login /></AuthRedirect>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="*" element={<Home />} />
            </Routes>
            </BodyColorWrapper>
        </Router>
    );
};

export default AppRoutes;
