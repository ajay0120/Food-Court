import React from 'react'
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if(token){
    return children;
  }
  // If no token, redirect to login page. 
  alert("Please login first");
  return <Navigate to="/login"/>;
  //return token ? children : <Navigate to="/login" />;
};


export default ProtectedRoute
