import React from 'react'
import Header from '../Widget/Header/Header'
import '../styles/home.css'
import MainContainer from '../Widget/MainContainer/MainContainer'
import DoubleContainer from '../Widget/DoubleContainer/DoubleContainer'

const home = () => {
  return (
    <div>
        <Header />
        <MainContainer />
        <DoubleContainer />
    </div>
  )
}

export default home