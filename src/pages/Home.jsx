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
  return (
    <div>
        <Header />
        <MainContainer />
        <DoubleContainer />
        <SecurityContainer />
        <AboutCompany />
        <FormUniversity />
        <Footer />
    </div>
  )
}

export default home