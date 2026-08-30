import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import HeaderForAuth from "../Widget/HeaderForAuth/HeaderForAuth";
import FooterForAuth from "../Widget/FooterForAuth/FooterForAuth";
import "../styles/Auth.css";

const API_URL = process.env.REACT_APP_API_URL;

const RegisterTeacher = () => {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const token = params.get("id");

  const [form, setForm] = useState({ lastName: "", firstName: "", middleName: "", password: "" });
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null); // { login, generatedPassword, institution }

  useEffect(() => { document.title = "SchedGo — Реєстрація викладача"; }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/teachers/self-register`, { slug, token, ...form });
      setDone(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Не вдалося зареєструватися");
    }
  };

  return (
    <div className="auth-container">
      <HeaderForAuth />
      <div className="Form_For_Auth">
        <div className="Auth_Form">
          {done ? (
            <>
              <div className="Text_Form">
                <h2 className="WelcomTextAuth">Готово!</h2>
                <h3 className="SadTextAuth">Ваш акаунт викладача створено{done.institution ? ` — ${done.institution}` : ""}</h3>
              </div>
              <div className="cred-box">
                <div className="cred-row"><span>Логін</span><b>{done.login}</b></div>
                {done.generatedPassword && (
                  <div className="cred-row"><span>Пароль</span><b>{done.generatedPassword}</b></div>
                )}
                <p className="cred-hint">Збережіть ці дані — пароль більше не показуватиметься.</p>
              </div>
              <a className="Form_button" href="/auth" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Перейти до входу</a>
            </>
          ) : !token ? (
            <div className="Text_Form">
              <h2 className="WelcomTextAuth">Недійсне посилання</h2>
              <h3 className="SadTextAuth">У посиланні відсутній код запрошення. Зверніться до представника закладу.</h3>
            </div>
          ) : (
            <>
              <div className="Text_Form">
                <h2 className="WelcomTextAuth">Реєстрація викладача</h2>
                <h3 className="SadTextAuth">Заповніть свої дані для доступу до розкладу</h3>
              </div>
              {error && <p className="auth-error">{error}</p>}
              <form onSubmit={submit} className="Form_SignIn">
                <div className="InputCss">
                  <label className="LabelCssForm">Прізвище</label>
                  <input className="Form_input" name="lastName" value={form.lastName} onChange={change} placeholder="Прізвище" required />
                </div>
                <div className="InputCss">
                  <label className="LabelCssForm">Імʼя</label>
                  <input className="Form_input" name="firstName" value={form.firstName} onChange={change} placeholder="Імʼя" required />
                </div>
                <div className="InputCss">
                  <label className="LabelCssForm">По батькові</label>
                  <input className="Form_input" name="middleName" value={form.middleName} onChange={change} placeholder="По батькові" required />
                </div>
                <div className="InputCss">
                  <label className="LabelCssForm">Пароль (необовʼязково)</label>
                  <input type="password" className="Form_input" name="password" value={form.password} onChange={change} placeholder="Залиште порожнім — згенеруємо" />
                </div>
                <button type="submit" className="Form_button">Зареєструватися</button>
              </form>
            </>
          )}
        </div>
      </div>
      <FooterForAuth />
    </div>
  );
};

export default RegisterTeacher;
