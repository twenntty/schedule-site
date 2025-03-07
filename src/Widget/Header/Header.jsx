import React from 'react'
import Logo from "../../assets/img/logo.png";
import { Link } from "react-router-dom";
import './header.css';
import ButtonLogin from '../../components/UI/ButtonLogin/ButtonLogin';

const Header = () => {
  return (
    <header className="header">
        <Link to="/">
            <img src={Logo} alt="Logo" className="logo" />
        </Link>

        <nav className="navbar">
            <a href="" className='nav'>Для навчальних закладів</a>
            <a href="" className='nav'>Безпека</a>
            <a href="" className='nav'>Про нас</a>
        </nav>

        <ButtonLogin />
    </header>
  )
}

export default Header