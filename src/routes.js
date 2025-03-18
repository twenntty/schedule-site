import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import RegisterUser from "./components/RegisterUser";
import MembersList from "./components/MembersList";
import CreateLesson from "./components/CreateLesson";
import CreateRoom from "./components/CreateRoom";
import CreatePeriod from "./components/CreatePeriod";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule"
import BodyColorWrapper from "./Widget/BodyColorWrapper/BodyColorWrapper";


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
        <Router basename="/">
            <BodyColorWrapper>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AuthRedirect><Login /></AuthRedirect>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/register" element={<RegisterUser />} />
                <Route path="/dashboard/members" element={<MembersList />} />
                <Route path="/dashboard/createlesson" element={<CreateLesson />} />
                <Route path="/inst/rooms" element={<CreateRoom />} />
                <Route path="/periods" element={<CreatePeriod />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="*" element={<Home />} />
            </Routes>
            </BodyColorWrapper>
        </Router>
    );
};

export default AppRoutes;
