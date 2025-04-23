import React from 'react'
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
//   console.log(role);
  if(role==="admin"){
    return children
  }
    alert("Page not found");
    return <Navigate to="/login"/>;
// return children;
};

export default AdminRoute;