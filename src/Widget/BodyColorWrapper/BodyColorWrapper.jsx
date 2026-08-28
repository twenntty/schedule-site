import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BodyColorWrapper = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/auth")) {
      document.body.style.backgroundColor = "white";
    } else if (location.pathname.startsWith("/dashboard")) {
      document.body.style.backgroundColor = "white"; // Цвет фона для дашборда
    } else if (location.pathname.startsWith("/schedule")) {
      document.body.style.backgroundColor = "#f5f5f7"; // Apple system background
  } else {
      document.body.style.backgroundColor = "#15292C";
    }

    return () => {
      document.body.style.backgroundColor = "#15292C"; // Возвращаем цвет при размонтировании
    };
  }, [location]);

  return children;
};

export default BodyColorWrapper;
