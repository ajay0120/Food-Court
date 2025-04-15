import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
    return null; // important to prevent rendering until we redirect
  }

  return children;
};

export default AdminRoute;