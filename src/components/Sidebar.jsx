import React from "react";
import "../styles/Sidebar.css";

const Sidebar = ({ setActivePage, activePage, role }) => {
    const menuItems = {
        admin: [
            { name: "Головна", page: "main" },
            { name: "Користувачі", page: "members" },
            { name: "Реєстрація", page: "register" },
            { name: "Запити", page: "rooms" },
            { name: "Звіти", page: "schedule" },
        ],
        institution: [
            { name: "Головна", page: "main" },
            { name: "Додати пару", page: "add-pair" },
            { name: "Коригування розкладу", page: "edit-schedule" },
            { name: "Викладачі", page: "teachers" },
            { name: "Тривалість пар", page: "time-pairs" },
            { name: "Спеціальності", page: "specialties" },
            { name: "Курси", page: "courses" },
            { name: "Групи", page: "groups" },
            { name: "Дисципліни", page: "disciplines" },
            { name: "Аудиторії", page: "auditoriums" },
            { name: "Розклад груп", page: "schedule-groups" },
            { name: "Розклад викладачів", page: "schedule-teachers" },
        ],
    };

    return (
        <div className="SidebarForDashboard">
            {menuItems[role]?.map((item, index) => (
                <div 
                    key={index} 
                    className={`ItemMenu ${activePage === item.page ? "active" : ""}`}
                    onClick={() => setActivePage(item.page)}
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
