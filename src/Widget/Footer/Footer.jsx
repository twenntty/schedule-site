import React from 'react'
import "./Footer.css"
import Logo from "../../assets/svg/LogoForAuth.svg";
import Inst from "../../assets/svg/Instagram.svg";
import Tele from "../../assets/svg/telegram-footer.svg";

const Footer = () => {
    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      };

  return (
    <footer>
        <div className="footer__inner">
            <div className="footer__brand">
                <img src={Logo} alt="SchedGO" className="logo" />
                <p className="fonts_e_ukraine">Шрифт e-Ukraine використовується відповідно до ліцензії CC BY 4.0</p>
                <p className="coop">schedgo.online © 2026</p>
            </div>

            <nav className="navbar_footer">
                <a onClick={() => scrollToSection("form")} className="nav">Для навчальних закладів</a>
                <a onClick={() => scrollToSection("security")} className="nav">Безпека</a>
                <a onClick={() => scrollToSection("about")} className="nav">Про нас</a>
            </nav>

            <div className="socialmedia">
                <h4 className='find_social'>Слідкуйте за нами</h4>
                <div className="social_icon">
                    <a href="https://www.instagram.com/sched.go/" target="_blank" rel="noopener noreferrer">
                        <img src={Inst} alt="Instagram" className='icon_inst' />
                    </a>
                    <a href="https://t.me/schedgo" target="_blank" rel="noopener noreferrer">
                        <img src={Tele} alt="Telegram" className='icon_telegram' />
                    </a>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
