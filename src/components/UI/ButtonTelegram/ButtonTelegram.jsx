import React from 'react'
import SVG from '../../../assets/svg/Telegram.svg'
import './ButtonTelegram.css'
import { Link } from 'react-router-dom';

const ButtonTelegram = () => {
  return (
    <Link to="/">
        <button className="button_telegram" > 
            Приєднатись до Telegram-боту
            <img src={SVG} alt='Telegram' style={{ width: '16px', height: '16px', marginLeft: '14px' }} />
        </button>
    </Link>
  )
}

export default ButtonTelegram