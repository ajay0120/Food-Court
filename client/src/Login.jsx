import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", email); // Store email as well

      alert("Login successful!");
      navigate("/"); // Redirect to Profile Page
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center p-5">
        <button className="text-orange-500 text-[50px] font-bold text-center flex-1 cursor-pointer"
          onClick={() => navigate("/")}>
          Food Court BVRIT
        </button>
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded-lg absolute right-10 cursor-pointer"
          onClick={() => navigate("/signup")} // Navigate to Signup Page
        >
          Sign Up
        </button>
      </div>

      {/* Login Form */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h2 className="text-4xl font-bold text-orange-500 mb-6">Login</h2>
        <form className="bg-gray-800 p-6 rounded-lg shadow-lg w-96" onSubmit={handleLogin}>
          <input
            className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white border border-gray-600"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white border border-gray-600"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full bg-orange-500 text-white p-3 rounded-md font-bold hover:bg-orange-600"
            type="submit"
          >
            Login
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
      </div>
    </div>
  );
};

export default Login;
