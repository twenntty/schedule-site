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
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`); // cookie auth
        setUser(response.data);
      } catch (error) {
        console.error("Помилка завантаження даних користувача:", error);
        if (error.response && error.response.status === 401) {
          window.location.href = "/auth";
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`);
    } catch (e) {
      // ignore — clear client state regardless
    }
    setUser(null);
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
