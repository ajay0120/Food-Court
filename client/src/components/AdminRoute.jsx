import React from 'react'
import { Navigate } from "react-router-dom";
import NotFound from '../NotFound';

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
//   console.log(role);
  if(role==="admin"){
    return children
  }
    return <NotFound />;
    // return <Navigate to="/login"/>;
// return children;
};

export default AdminRoute;