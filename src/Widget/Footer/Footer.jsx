import React from 'react'
import "./Footer.css"
import Logo from "../../assets/img/logo.png";
import Inst from "../../assets/svg/Instagram.svg";
import Tele from "../../assets/svg/telegram-footer.svg";
import Smile from "../../assets/svg/smile.svg";

const Footer = () => {
    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      };

  return (
    <footer>
        <div className="line"></div>
        <div className="smile_sticker">
            <img src={Smile} alt="Smile sticker" className='Smile' />
        </div>
        <div className="socialmedia">
            <h4 className='find_social'>Cлідкуйте за SCHED GO тут</h4>
                <div className="social_icon">
                    <a href="https://www.instagram.com/sched.go/" target="_blank" rel="noopener noreferrer">
                        <img src={Inst} alt="Instagram" className='icon_inst' />
                    </a>
                    <a href="https://t.me/schedgo" target="_blank" rel="noopener noreferrer">
                        <img src={Tele} alt="Telegram" className='icon_telegram' />
                    </a>
                </div>
        </div>
        <nav className="navbar_footer">
            <a onClick={() => scrollToSection("form")} className="nav">Для навчальних закладів</a>
            <a onClick={() => scrollToSection("security")} className="nav">Безпека</a>
            <a onClick={() => scrollToSection("about")} className="nav">Про нас</a>
        </nav>
        <div className="coopyright">
            <p className="fonts_e_ukraine">Шрифт e-Ukraine використовується відповідно до ліцензії CC BY 4.0</p>
            <p className="coop">schedgo.online © 2025</p>
            
            <img src={Logo} alt="Logo" className="logo" />
        </div>
    </footer>
  )
}

export default Footer