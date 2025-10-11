import React from 'react'
import { Navigate } from "react-router-dom";
import NotFound from '../NotFound';
import { USER_ROLES } from '../../../common/userEnums';

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
//   console.log(role);
  if(role===USER_ROLES.ADMIN){
    return children
  }
    return <NotFound />;
    // return <Navigate to="/login"/>;
// return children;
};

export default AdminRoute;