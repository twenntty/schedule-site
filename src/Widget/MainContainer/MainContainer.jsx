import React from 'react'
import './MainContainer.css'
import Iphone from '../../assets/img/iphone-bot.png'
import ButtonSchedule from '../../components/UI/ButtonSchedule/ButtonSchedule'
import ButtonTelegram from '../../components/UI/ButtonTelegram/ButtonTelegram'

const MainContainer = () => {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title">SchedGO - твій помічник</h1>
        <p className="hero__subtitle">
          Забудьте про запізнення і хаос. Усе необхідне для вашого навчального процесу - в одному місці.
        </p>
        <div className="hero__cta">
          <ButtonSchedule />
          <ButtonTelegram />
        </div>
      </div>

      <div className="hero__device">
        <img src={Iphone} alt="SchedGO у Telegram" />
      </div>
    </section>
  )
}

export default MainContainer
