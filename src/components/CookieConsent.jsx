import React, { useEffect, useState } from "react";
import "../styles/CookieConsent.css";

const STORAGE_KEY = "cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Згода на використання файлів cookie">
      <div className="cookie-banner__text">
        <p className="cookie-banner__title">Ми використовуємо файли cookie</p>
        <p className="cookie-banner__desc">
          Обовʼязкові cookie потрібні для входу та роботи кабінету. Додаткові cookie
          допомагають нам покращувати сервіс — ви можете їх прийняти або відхилити.
        </p>
      </div>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-btn cookie-btn--ghost" onClick={() => decide("declined")}>
          Відхилити
        </button>
        <button type="button" className="cookie-btn cookie-btn--primary" onClick={() => decide("accepted")}>
          Прийняти
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
