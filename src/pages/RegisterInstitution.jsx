import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import HeaderForAuth from "../Widget/HeaderForAuth/HeaderForAuth";
import FooterForAuth from "../Widget/FooterForAuth/FooterForAuth";
import "../styles/Auth.css";

const API_URL = process.env.REACT_APP_API_URL;

const TIMEZONES = [
  "Europe/Kyiv",
  "Europe/Warsaw",
  "Europe/Chisinau",
  "Europe/Bucharest",
  "Europe/Berlin",
  "Europe/London",
  "Asia/Almaty",
];

const RegisterInstitution = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    institutionName: "",
    timezone: "Europe/Kyiv",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => { document.title = "SchedGo — Реєстрація закладу"; }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post(`${API_URL}/auth/register-institution`, form);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || data?.errors?.[0]?.msg || "Не вдалося зареєструвати заклад");
    }
  };

  return (
    <div className="auth-container">
      <HeaderForAuth />
      <div className="Form_For_Auth">
        <div className="Auth_Form">
          <div className="Text_Form">
            <h2 className="WelcomTextAuth">Реєстрація закладу</h2>
            <h3 className="SadTextAuth">Створіть навчальний заклад і акаунт представника</h3>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <form onSubmit={submit} className="Form_SignIn">
            <div className="InputCss">
              <label className="LabelCssForm">Назва закладу</label>
              <input className="Form_input" name="institutionName" value={form.institutionName} onChange={change} placeholder="Напр. Київський університет технологій" required />
            </div>
            <div className="InputCss">
              <label className="LabelCssForm">Часовий пояс</label>
              <select className="Form_input" name="timezone" value={form.timezone} onChange={change}>
                {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
            <div className="InputCss">
              <label className="LabelCssForm">Прізвище представника</label>
              <input className="Form_input" name="lastName" value={form.lastName} onChange={change} placeholder="Прізвище" required />
            </div>
            <div className="InputCss">
              <label className="LabelCssForm">Імʼя представника</label>
              <input className="Form_input" name="firstName" value={form.firstName} onChange={change} placeholder="Імʼя" required />
            </div>
            <div className="InputCss">
              <label className="LabelCssForm">Email</label>
              <input type="email" className="Form_input" name="email" value={form.email} onChange={change} placeholder="Email" required />
            </div>
            <div className="InputCss">
              <label className="LabelCssForm">Пароль</label>
              <input type="password" className="Form_input" name="password" value={form.password} onChange={change} placeholder="Мінімум 6 символів" required />
            </div>
            <button type="submit" className="Form_button">Зареєструвати заклад</button>
            <p className="auth-switch">Вже маєте акаунт? <Link to="/auth">Увійти</Link></p>
          </form>
        </div>
      </div>
      <FooterForAuth />
    </div>
  );
};

export default RegisterInstitution;
