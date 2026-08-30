import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        let active = true;
        // The token lives in an httpOnly cookie, so we ask the server who we are.
        axios
            .get(`${process.env.REACT_APP_API_URL}/auth/me`, { withCredentials: true })
            .then((res) => { if (active) setIsAuthenticated(!!res.data && !!res.data._id); })
            .catch(() => { if (active) setIsAuthenticated(false); });
        return () => { active = false; };
    }, []);

    if (isAuthenticated === null) {
        return <div className="loading-screen">Завантаження…</div>;
    }

    return isAuthenticated ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
