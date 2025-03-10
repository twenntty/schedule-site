import React from 'react'
import Header from '../Widget/Header/Header'
import '../styles/home.css'
import MainContainer from '../Widget/MainContainer/MainContainer'
import DoubleContainer from '../Widget/DoubleContainer/DoubleContainer'
import SecurityContainer from '../Widget/SecurityContainer/SecurityContainer'
import AboutCompany from '../Widget/AboutCompany/AboutCompany'
import Footer from '../Widget/Footer/Footer'
import FormUniversity from '../Widget/FormUniversity/FormUniversity'

const home = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div>
        <Header />
        <div id="main"><MainContainer /></div>
        <div id="double"><DoubleContainer /></div>
        <div id="security"><SecurityContainer /></div>
        <div id="about"><AboutCompany /></div>
        <div id="form"><FormUniversity /></div>
        <Footer />
    </div>
  )
}

export default home