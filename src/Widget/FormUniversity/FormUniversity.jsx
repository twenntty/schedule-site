import React, { useState } from "react";
import "./FormUniversity.css";
import SmileForForm from "../../assets/svg/smile_form.svg";

const FormUniversity = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    studentCount: "",
    contactNumber: "",
    email: "",
    consent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consent) {
      alert("❌ Ви повинні дати згоду на передачу даних!");
      return;
    }

    const payload = {
      requestType: "Участь навчального закладу", // ✅ Фіксований тип запиту
      schoolName: formData.schoolName,
      studentCount: Number(formData.studentCount), // ✅ Записуємо як число
      contactNumber: formData.contactNumber,
      email: formData.email,
    };

    try {
      const response = await fetch("http://localhost:3001/api/requests/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("✅ Відповідь сервера:", result);
      alert("Дякуємо за вашу довіру! Незабаром з вами зв'яжуться.");
    } catch (error) {
      console.error("❌ Помилка відправки:", error);
      alert("❌ Виникла помилка, спробуйте пізніше!");
    }
  };

  return (
    <div className="adduniversity_main">
      <div className="textandbutton_adduniversity">
        <h3 className="AddSchedGo">Долучайтесь до Sched GO</h3>
        <div className="button_form_school">
          <button className="Adduniversity active">Участь навчального закладу</button>
        </div>
      </div>

      <div className="form_for_add">
        <img src={SmileForForm} alt="SmileForForm" className="smiley" />
        <form onSubmit={handleSubmit} className="FormAdd">
          <p className="aboutuni_form">Про заклад</p>
          <div className="all_input">
            <input
              type="text"
              name="schoolName"
              className="input_form"
              placeholder="Повна назва освітнього закладу"
              value={formData.schoolName}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="studentCount"
              className="input_form"
              placeholder="Кількість студентів"
              value={formData.studentCount}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="contactNumber"
              className="input_form"
              placeholder="Контактний номер"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              className="input_form"
              placeholder="Електронна адреса"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="checkbox_flex">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  className="customcheckbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                />
                <span className="checkmark"></span>
                Я даю згоду на передачу та обробку моїх персональних даних
              </label>
            </div>
            <button type="submit" className="button_for_add_univers">
              Надіслати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormUniversity;
