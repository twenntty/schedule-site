import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Импортируем useNavigate
import AdminLogo from "../../assets/svg/logoForAdmin.svg"
import UniLogo from "../../assets/svg/logoforuni.svg"
import Logo from "../../assets/svg/LogoForAuth.svg"
import "./HeaderForDashboard.css"
import LogOut from "../../assets/svg/Logout.svg"

const roleLogos = {
  admin: AdminLogo,
  institution: UniLogo,
  user: Logo,
};

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Инициализируем хук navigate
  
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("Токен отсутствует, пользователь не авторизован");
        return;
      }

      try {
        const response = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Ошибка загрузки данных пользователя:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/auth"; // Если токен неверный, направляем на страницу авторизации
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Удаляем токен
    navigate("/auth"); // Перенаправляем на страницу авторизации
  };

  if (!user) {
    return <div className="p-4 text-white">Загрузка...</div>;
  }

  return (
    <header className="headerForAuth">
      <img src={roleLogos[user.role] || roleLogos.guest} alt="Logo" className="LogoForDashboard" />
      <div className="InfoAndExit">
        <div className="InfoAccount">
          <p className="textInfoAccount">{user.lastName} {user.firstName}</p>
        </div>
        <div onClick={handleLogout} className="ButtonForExit">
          <img src={LogOut} alt="Выход" className="IconForLogOut" />
        </div>
      </div>
    </header>
  );
};

export default Header;
