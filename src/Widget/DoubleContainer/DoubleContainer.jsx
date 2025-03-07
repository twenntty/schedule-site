import React from 'react'
import './DoubleContainer.css'
import AddUniveristy from '../../components/UI/AddUniveristy/AddUniveristy'

const DoubleContainer = () => {
  return (
    <div className='main_double'>
        <div className="text">
            <div className="main_text_double">
                <h3>Навчальні заклади</h3>
                <p className="about">
                Sched GO — зручний інструмент для організації розкладу для всіх студентів і викладачів вашого навчального закладу.Наш сервіс дозволяє легко створювати, оновлювати та переглядати розклади, а також автоматично отримувати сповіщення про зміни.
                </p>
            </div>
            <div className='button_add'>
                <AddUniveristy />
            </div>
        </div>
        <div className="lightin">
            <div className="lightin_all">
                <div className="number_one">
                    <p className="name_one">Легке управління розкладом</p>
                    <p className="about_one">Онлайн-інтерфейс для швидкого оновлення та внесення змін.</p>
                </div>
                <div className="number_two">
                    <p className="name_one">Зручність для студентів</p>
                    <p className="about_one">Студенти отримують доступ до актуальних розкладів у будь-який час.</p>
                </div>
                <div className="number_three">
                    <p className="name_one">Мінімізація помилок</p>
                    <p className="about_one">Забудьте про помилки в розкладі завдяки автоматизації процесу.</p>
                </div>
                <div className="number_four">
                    <p className="name_one">Безпека та надійність</p>
                    <p className="about_one">Ми забезпечуємо конфідеційність даних та працюємо над постійним покращенням безпеки.</p>
                </div>
                <div className="number_five">
                    <p className="name_one">Економія часу</p>
                    <p className="about_one">Замість витрат на паперову документацію або інші складні системи, наш сервіс надає вам простий, швидкий і ефективний спосіб управління розкладами.</p>
                </div>
                <div className="number_six">
                    <p className="name_one">Навантаження викладачів</p>
                    <p className="about_one">Sched GO автоматично збирає інформацію про кількість годин, проведених кожним викладачем, що дозволяє ефективно контролювати та оптимізувати їхнє навантаження.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DoubleContainer