import React from 'react'
import './ButtonLogin.css'
import { Link } from 'react-router-dom';

const ButtonLogin = () => {
  return (
    <Link to="/auth">
    <button className="button_login" >Увійти до Sched</button>
    </Link>
  )
}

export default ButtonLogin