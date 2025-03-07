import React from 'react'
import SVG from '../../../assets/svg/Calendar.svg'
import './ButtonSchedule.css'
import { Link } from 'react-router-dom';

const ButtonSchedule = () => {
  return (
    <Link to="/schedule">
        <button className="button_schedule" > 
            Перейти до розкладу
            <img src={SVG} alt='Calendar' style={{ width: '16px', height: '16px', marginLeft: '12px' }} />
        </button>
    </Link>
  )
}

export default ButtonSchedule