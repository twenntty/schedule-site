import React, { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeaderForDashboard from "../Widget/HeaderForDashboard/HeaderForDashboard";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

const Main = lazy(() => import("./MainDashboard/MainDashboard"));
const Teachers = lazy(() => import("./CreateTeachers"));
const AddPair = lazy(() => import("./CreateLesson"));
const TimePairs = lazy(() => import("./CreatePeriod"));
const Auditoriums = lazy(() => import("./CreateRoom"));
const Speciality = lazy(() => import("./CreateSpeciality"));
const ManageCourses = lazy(() => import("./СreateCourse"));
const ManageGroups = lazy(() => import("./ManageGroups"));
const ManageStudentsSchedule = lazy(() => import("../pages/StudentSchedule"));
const ManageTeachersSchedule = lazy(() => import("../pages/TeacherSchedule"));
const EditSchedule = lazy(() => import("../pages/EditSchedule"));
const RegisterUser = lazy(() => import("../components/RegisterUser"));

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activePage, setActivePage] = useState("main");

    useEffect(() => {
        document.title = "Дашбоард | SchedGo";
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) navigate("/auth");
                
                const apiUrl = `${process.env.REACT_APP_API_URL}/auth/me`;
                const response = await axios.get(apiUrl, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
                navigate("/auth");
            }
        };

        fetchUserData();
    }, [navigate]);

    const renderContent = () => {
        switch(activePage) {
            case "teachers":
                return <Teachers />;
            case "add-pair":
                return <AddPair />;
            case "auditoriums":
                return <Auditoriums />;
            case "time-pairs":
                return <TimePairs />;
            case "specialties":
                return <Speciality />;
            case "courses":
                return <ManageCourses />;
            case "groups":
                return <ManageGroups />;
            case "schedule-groups":
                return <ManageStudentsSchedule />;  
            case "schedule-teachers":
                return <ManageTeachersSchedule />;  
            case "edit-schedule":
                return <EditSchedule />; 
            case "register":
                return <RegisterUser />; 
                
                
                
            default:
                return <Main user={user} />;
        }
    };

    if (!user) return <div className="loading-screen">Загрузка данных пользователя...</div>;

    return (
        <div className="Dashboard">
            <HeaderForDashboard user={user} />
            <div className="DashboardFlex">
                <Sidebar 
                    role={user.role} 
                    activePage={activePage}
                    setActivePage={setActivePage}
                />
                <div className="MainDashboard">
                    <Suspense fallback={<div className="loading-module">Загрузка модуля...</div>}>
                        {renderContent()}
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;