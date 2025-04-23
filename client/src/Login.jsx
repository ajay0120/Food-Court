import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api/axios"; // Axios instance with baseURL

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });

  // Auto login if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      navigate(role === "admin" ? "/admin" : "/profile");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", general: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name",user.name);
      navigate(user.role === "admin" ? "/admin" : "/profile");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";

      setErrors((prev) => ({
        ...prev,
        general: message,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center p-5">
        <button
          className="text-orange-500 text-[50px] font-bold text-center flex-1 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Food Court BVRIT
        </button>
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded-lg absolute right-10 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>

      {/* Login Form */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h2 className="text-4xl font-bold text-orange-500 mb-6">Login</h2>
        <form className="bg-gray-800 p-6 rounded-lg shadow-lg w-96" onSubmit={handleLogin}>
          <input
            className="w-full p-3 mb-2 rounded-md bg-gray-700 text-white border border-gray-600"
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

          <input
            className="w-full p-3 mb-2 rounded-md bg-gray-700 text-white border border-gray-600"
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

          {errors.general && <p className="text-red-500 text-sm mb-3">{errors.general}</p>}

          <button
            className="w-full bg-orange-500 text-white p-3 rounded-md font-bold hover:bg-orange-600"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4">
          Don't have an account?{" "}
          <span
            className="text-orange-500 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
        <p className="mt-4">
          Forgot Password?{" "}
          <span
            className="text-orange-500 cursor-pointer"
            onClick={() => navigate("/forgotPass")}
          >
            Click Here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
