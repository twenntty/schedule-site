import React from 'react'
import SVG from '../../../assets/svg/Telegram.svg'
import './ButtonTelegram.css'

const ButtonTelegram = () => {
  return (
    <a href="https://t.me/SchedGoAssistantBot" target="_blank" rel="noopener noreferrer">
      <button className="button_telegram">
        Приєднатись до Telegram-боту
        <img src={SVG} alt="Telegram" style={{ width: '16px', height: '16px', marginLeft: '14px' }} />
      </button>
    </a>
  );
};

export default ButtonTelegram;