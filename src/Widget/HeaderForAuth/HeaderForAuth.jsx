import React from 'react'
import "./HeaderForAuth.css"
import LogoForAuth from "../../assets/svg/LogoForAuth.svg"
import BackArrow from "../../assets/svg/Back_arrow.svg"
import { Link } from "react-router-dom";

const HeaderForAuth = () => {
  return (
    <header className="headerforauth">
        <Link to="/" className='BackSite'>
            <img src={BackArrow} alt="ArrowBack" className="backarrow_for_header" />
            <p className="back_to_site">Повернутись на головну</p>
        </Link>

        <img src={LogoForAuth} alt="Logo" className="logoforauth" />
    </header>
  )
}

export default HeaderForAuth