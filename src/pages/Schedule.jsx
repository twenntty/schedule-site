import React, { useState } from "react";
import { Link } from "react-router-dom";
import LOGO from "../assets/svg/LogoForAuth.svg";
import "../styles/Schedule.css";
import StudentSchedule from "./StudentSchedule";
import TeacherSchedule from "./TeacherSchedule";

const Home = () => {
    const [activeTab, setActiveTab] = useState("students");

    return (
        <div className="Schedule_Component">
            <div className="HeaderForSchedule">
                <div className="logoForSchedule">
                    <Link to="/" className="logoLinkForSchedule" aria-label="На головну">
                        <img src={LOGO} alt="SchedGO" className="LogoImgForSchedule" />
                    </Link>
                </div>
                <div className="main_header_for_schedule">
                    <div className="navbarForSchedule">
                        <div className="textForSchedule">
                            <p 
                                className={`ScheduleNav ${activeTab === "students" ? "active" : ""}`} 
                                onClick={() => setActiveTab("students")}
                            >
                                Розклад занять
                            </p>
                            <p 
                                className={`ScheduleNav ${activeTab === "teachers" ? "active" : ""}`} 
                                onClick={() => setActiveTab("teachers")}
                            >
                                Розклад для викладачів
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {activeTab === "students" ? <StudentSchedule /> : <TeacherSchedule />}
        </div>
    );
};

export default Home;