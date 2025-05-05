import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    if (isAuthenticated === null) {
        return <div>Загрузка...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
