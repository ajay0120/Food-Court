import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  if(!token){
    alert("Please login first");
    return <Navigate to="/login"/>;
  }
  const currentTime = Date.now() / 1000; // in seconds
  if (decoded && decoded.exp < currentTime) {
    // Token has expired
    localStorage.removeItem("token");
    alert("Please login first");
    return <Navigate to="/login"/>;
  }
  return children;
};


export default ProtectedRoute
