import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import AppRoutes from "./routes";

// Send the httpOnly auth cookies with every API request (cookie-based auth).
axios.defaults.withCredentials = true;

// Transparent access-token refresh: on a 401, try /auth/refresh once, then retry.
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const cfg = error.config || {};
    const url = cfg.url || "";
    const isAuthFlow = url.includes("/auth/refresh") || url.includes("/auth/login");
    if (error.response?.status === 401 && !cfg._retry && !isAuthFlow) {
      cfg._retry = true;
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh`);
        return axios(cfg);
      } catch (e) {
        // refresh failed — fall through to the original 401
      }
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppRoutes />);
