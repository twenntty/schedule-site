import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import RegisterUser from "./components/RegisterUser";
import MembersList from "./components/MembersList";
import CreateLesson from "./components/CreateLesson";
import CreateRoom from "./components/CreateRoom";
import CreatePeriod from "./components/CreatePeriod";

const AuthRedirect = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard"); // ✅ Если токен есть, перенаправляем на /dashboard
        }
    }, [navigate]);

    return children;
};

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AuthRedirect><Login /></AuthRedirect>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/register" element={<RegisterUser />} />
                <Route path="/dashboard/members" element={<MembersList />} />
                <Route path="/dashboard/createlesson" element={<CreateLesson />} />
                <Route path="/inst/rooms" element={<CreateRoom />} />
                <Route path="/periods" element={<CreatePeriod />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
