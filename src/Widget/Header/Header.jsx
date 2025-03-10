import React from 'react'
import Logo from "../../assets/img/logo.png";
import { Link } from "react-router-dom";
import './header.css';
import ButtonLogin from '../../components/UI/ButtonLogin/ButtonLogin';

const Header = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="header">
        <Link to="/">
            <img src={Logo} alt="Logo" className="logo" />
        </Link>

        <nav className="navbar">
          <a onClick={() => scrollToSection("form")} className="nav">Для навчальних закладів</a>
          <a onClick={() => scrollToSection("security")} className="nav">Безпека</a>
          <a onClick={() => scrollToSection("about")} className="nav">Про нас</a>
        </nav>

        <ButtonLogin />
    </header>
  )
}

export default Header