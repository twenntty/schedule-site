import React from 'react'
import './SecurityContainer.css'
import SecuritySVG from "../../assets/svg/security.svg"

const SecurityContainer = () => {
  return (
    <div className="main_security">
        <div className="security_text">
                <h3 className='Security_header'>Безпека в SCHED GO</h3>
                <img src={SecuritySVG} alt="Security" className='svg_security' />
        </div>

        <div className="about_security">
            <p className="security">
            Ваші персональні дані зберігаються та обробляються з максимальною увагою до конфіденційності та безпеки.
            </p>

            <p className="security">
            Всі дані, пов'язані з автоматизованим розкладом, зберігаються виключно на захищених серверах, що відповідають сучасним стандартам захисту інформації.
            </p>

            <p className="security">
            Для забезпечення найвищого рівня безпеки ми використовуємо сучасні методи шифрування даних, які гарантують їх захист під час зберігання та передачі між користувачами і нашою системою. 
            </p>

            <p className="security">
            Ваші дані знаходяться під надійною охороною, і ми не передаємо їх третім особам без вашої згоди. 
            </p>
        </div>
    </div>
  )
}

export default SecurityContainer