import React from 'react'
import "./Footer.css"
import Logo from "../../assets/img/logo.png";
import { Link } from "react-router-dom";
import Inst from "../../assets/svg/Instagram.svg";
import Smile from "../../assets/svg/smile.svg";

const Footer = () => {
  return (
    <footer>
        <div className="line"></div>
        <div className="smile_sticker">
            <img src={Smile} alt="Smile sticker" className='Smile' />
        </div>
        <div className="socialmedia">
            <h4 className='find_social'>Cлідкуйте за SCHED GO тут</h4>
            <a href="https://www.instagram.com/sched.go/" target="_blank" rel="noopener noreferrer">
                <img src={Inst} alt="Instagram" className='icon_inst' />
            </a>
        </div>
        <nav className="navbar_footer">
            <a href="" className='nav'>Для навчальних закладів</a>
            <a href="" className='nav'>Безпека</a>
            <a href="" className='nav'>Про нас</a>
        </nav>
        <div className="coopyright">
            <p className="fonts_e_ukraine">Шрифт e-Ukraine використовується відповідно до ліцензії CC BY 4.0</p>
            <p className="coop">schedgo.online © 2025</p>
            <Link to="/">
                <img src={Logo} alt="Logo" className="logo" />
            </Link>
        </div>
    </footer>
  )
}

export default Footer