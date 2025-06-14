import React from 'react'
import Logo from "../../assets/img/logo.png"
import INST from "../../assets/svg/instagram.svg"
import "./FooterForAuth.css"

const FooterForAuth = () => {
  return (
        <div className="footerForAuth">
            <div className="logoAndText">
                <img src={Logo} alt="Logo" className='LogoForAuthFooter' />
                <div className="TextFooter">
                    <p className="Cooperate">Всі права захищені.</p>
                    <p className="Cooperate">© 2025 schedgo.online </p>
                </div>
            </div>
            <div className="SocialMediaFooter">
                <p className="FindSocialMedia">Слідкуй за нами тут:</p>
                <a href="https://www.instagram.com/sched.go/" target="_blank" rel="noopener noreferrer">
                    <img src={INST} alt="Instagram" className='InstagramFooter' />
                </a>
            </div>
        </div>
  )
}

export default FooterForAuth