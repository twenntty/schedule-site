import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import RegisterInstitution from "./pages/RegisterInstitution";
import RegisterTeacher from "./pages/RegisterTeacher";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import BodyColorWrapper from "./Widget/BodyColorWrapper/BodyColorWrapper";
import PrivateRoute from "./components/PrivateRoute";
import CookieConsent from "./components/CookieConsent";

const AppRoutes = () => {
    return (
        <Router basename="/">
            <BodyColorWrapper>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Login />} />
                    <Route path="/register-institution" element={<RegisterInstitution />} />
                    <Route path="/register/:slug/teacher" element={<RegisterTeacher />} />
                    
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    
                    <Route path="/schedule" element={
                            <Schedule />
                    } />

                    <Route path="*" element={<Home />} />
                </Routes>
                <CookieConsent />
            </BodyColorWrapper>
        </Router>
    );
};

export default AppRoutes;
