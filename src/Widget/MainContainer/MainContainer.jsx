import React from 'react'
import './MainContainer.css'
import Telephone from '../../assets/img/Frame 1.png'
import ButtonSchedule from '../../components/UI/ButtonSchedule/ButtonSchedule'
import ButtonTelegram from '../../components/UI/ButtonTelegram/ButtonTelegram'

const MainContainer = () => {
  return (
    <div className="main">
        <div className="text_and_button">
            <div className="main_text">
                <h1 className='gradient'>SCHED GO - ТВІЙ ПОМІЧНИК</h1>
                <p className='plus_info'>Забудьте про запізнення і хаос! Усе необхідне для вашого навчального процесу в одному місці 🗓️</p>
            </div>
                <div className="button">
                    <p className='Everyone_text'>КОЖЕН ВЖЕ КОРИСТУЄТЬСЯ</p>
                    <div className="button_rozklad">
                            <ButtonSchedule />
                            <ButtonTelegram />
                        </div>
                </div>
        </div>
        <div className="telephone">
            <img src={Telephone} alt="bot" />
        </div>
    </div>
  )
}

export default MainContainer