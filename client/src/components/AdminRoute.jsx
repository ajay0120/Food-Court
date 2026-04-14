import React from "react";
import { Navigate } from "react-router-dom";
import { USER_ROLES } from '../../../common/userEnums';
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded?.exp && decoded.exp < Date.now() / 1000) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (role === USER_ROLES.ADMIN) {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default AdminRoute;
