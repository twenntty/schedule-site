import React from 'react';
import "./MainDashboard.css";

const MainDashboard = ({ user }) => {
    return (
        <div className="MainDashboardDiv">
            <div className="MainTextDashboard">
                <p className="text">Головна</p>
            </div>
            <div className="mainDashInfo">
                <div className="mainDash">
                    <div className="AboutDashboard">
                    <p className="NameUserDashboard">{user.lastName}</p>
                        <p className="NameUserDashboard">{user.firstName}</p>
                        <p className="NameUserDashboard">{user.patronymic}</p>
                        <p className="UniversityDashboard">{user.educationalInstitution}</p>
                        <br />
                        <p className="PositionUserDashboard">{user.position}</p>
                        <p className="NumberUserDashboard">{user.phoneNumber}</p>
                    </div>
                    <div className="NumberGroups">
                        <p className="NameUserDashboard">{user.firstName}</p>
                        <p className="NameUserDashboard">{user.lastName}</p>
                        <p className="NameUserDashboard">{user.firstName}</p>
                        <p className="UniversityDashboard">{user.firstName}</p>
                        <br />
                        <p className="PositionUserDashboard">{user.position}</p>
                        <p className="NumberUserDashboard">{user.firstName}</p>
                    </div>
                </div>
                <div className="HourTeacher">
                        <p className="NameUserDashboard">{user.firstName}</p>
                        <p className="NameUserDashboard">{user.lastName}</p>
                        <p className="NameUserDashboard">{user.firstName}</p>
                        <p className="UniversityDashboard">{user.firstName}</p>
                        <br />
                        <p className="PositionUserDashboard">{user.position}</p>
                        <p className="NumberUserDashboard">{user.firstName}</p>
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;