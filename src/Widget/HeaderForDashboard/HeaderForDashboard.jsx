import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("Токен відсутній, користувач не авторизований");
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Помилка завантаження даних користувача:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/auth";
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  if (!user) {
    return <div className="p-4 text-white">Завантаження...</div>;
  }

  return (
    <header className="headerForAuth">
      <img src={roleLogos[user.role] || roleLogos.guest} alt="Logo" className="LogoForDashboard" />
      <div className="InfoAndExit">
        <div className="InfoAccount">
          <p className="textInfoAccount">{user.lastName} {user.firstName}</p>
        </div>
        <div onClick={handleLogout} className="ButtonForExit">
          <img src={LogOut} alt="Вихід" className="IconForLogOut" />
        </div>
      </div>
    </header>
  );
};

export default Header;
