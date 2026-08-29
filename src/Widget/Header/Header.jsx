import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import Logo from "../../assets/svg/LogoForAuth.svg";
import './header.css';
import ButtonLogin from '../../components/UI/ButtonLogin/ButtonLogin';

const Header = () => {
  const [compact, setCompact] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      setCompact(window.scrollY > 90);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Logo lives only at the top of the page and never rides with the capsule */}
      <Link
        to="/"
        className={`header__brand ${compact ? "header__brand--gone" : ""}`}
        aria-label="SchedGO - головна"
      >
        <img src={Logo} alt="SchedGO" className="logo" />
      </Link>

      <header className={`header ${compact ? "header--compact" : ""}`}>
        <div className="header__inner">
          <nav className="navbar">
            <button type="button" onClick={() => scrollToSection("form")} className="nav">Для навчальних закладів</button>
            <button type="button" onClick={() => scrollToSection("security")} className="nav">Безпека</button>
            <button type="button" onClick={() => scrollToSection("about")} className="nav">Про нас</button>
          </nav>

          <ButtonLogin />
        </div>
      </header>
    </>
  )
}

export default Header
