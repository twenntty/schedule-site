import React from 'react'
import "./FormUniversity.css"
import SmileForForm from "../../assets/svg/smile_form.svg"

const FormUniversity = () => {
  return (
    <div className="adduniversity_main">
      <div className="textandbutton_adduniversity">
        <h3 className='AddSchedGo'>Долучайтесь до Sched GO</h3>
        <div className="button_form_school">
          <button className='Adduniversity'>Участь навчального закладу</button>
          <button className="information_button">Запит на інформацію</button>
        </div>
      </div>

      <div className="form_for_add">
        <img src={SmileForForm} alt="SmileForForm" className="smiley" />
        <form action="" className='FormAdd'>
          <p className='aboutuni_form'>Про заклад</p>
          <div className="all_input">
          <input type="text" name="schoolName" className='input_form' placeholder="Повна назва освітнього закладу" />
          <input type="number" name="studentCount" className='input_form' placeholder="Кількість студентів" />
          <input type="text" name="contactNumber" className='input_form' placeholder="Контактний номер" />  
          <input type="email" name="email" className='input_form' placeholder="Електронна адреса" />        
          <div className="checkbox_flex">
            <label class="custom-checkbox">
                <input type="checkbox" class="customcheckbox" />
                <span class="checkmark"></span>
                Я даю згоду на передачу та обробку моїх персональних даних
            </label>
          </div>
          <button type="submit" className='button_for_add_univers'> Надіслати</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormUniversity