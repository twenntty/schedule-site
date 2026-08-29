import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BodyColorWrapper = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/auth")) {
      document.body.style.backgroundColor = "#f5f5f7";
    } else if (location.pathname.startsWith("/dashboard")) {
      document.body.style.backgroundColor = "#f5f5f7"; // Apple system background
    } else if (location.pathname.startsWith("/schedule")) {
      document.body.style.backgroundColor = "#f5f5f7"; // Apple system background
  } else {
      document.body.style.backgroundColor = "#ffffff";
    }

    return () => {
      document.body.style.backgroundColor = "#ffffff";
    };
  }, [location]);

  return children;
};

export default BodyColorWrapper;
