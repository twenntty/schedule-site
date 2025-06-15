import React, { useState, useEffect } from 'react';
import "./MainDashboard.css";
import axios from 'axios';

const MainDashboard = ({ user }) => {
    const [teachersHours, setTeachersHours] = useState([]);
    const [groupCount, setGroupCount] = useState(0);

    useEffect(() => {
        const fetchGroupCount = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${apiUrl}/api/groups/count`);
                setGroupCount(response.data.count);
            } catch (error) {
                console.error('Ошибка загрузки количества групп:', error);
            }
        };
        fetchGroupCount();
    }, []);

    useEffect(() => {
        const fetchTeachersHours = async () => {
          try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/teachers/with-hours`);
            const data = await response.json();
            setTeachersHours(data);
          } catch (error) {
            console.error('Ошибка загрузки:', error);
          }
        };
        fetchTeachersHours();
      }, []);

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
                        <p className="NumGroupText">К-сть навчальних груп:</p>
                        <div className='GroupCount'>
                        <p className="NumGroupCount">{groupCount}</p>
                        </div>
                    </div>
                </div>
                <div className="HourTeacher">
                <span className='Teacher-Hours_Text'>Інформація по годинам Викладачів :</span>
                {teachersHours.length > 0 ? (
                    teachersHours.map(teacher => (
                    <div key={teacher._id} className="teacher-hour-item">
                        <p className="teacher-name">
                        {teacher.lastName} {teacher.firstName} {teacher.middleName}
                        </p>
                        <p className="teacher-hours">{teacher.monthlyHours} год</p>
                    </div>
                    ))
                ) : (
                    <p>Немає даних про викладачів</p>
                )}
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;