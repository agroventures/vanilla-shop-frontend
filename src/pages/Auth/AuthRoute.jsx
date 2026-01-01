import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const AuthRoute = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (role !== "admin") {
        return <Navigate to="/" />;
    }

    return <Outlet />
}

export default AuthRoute