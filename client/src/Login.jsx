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
      alert("Login successful!");
      navigate("/"); // Redirect to homepage
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center relative">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center p-5">
        <h1 className="text-orange-500 text-[50px] font-bold text-center flex-1">
          Food Court BVRIT
        </h1>

        {/* Back to Home Button */}
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded-lg absolute right-10 hover:bg-gray-600"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>

      {/* Login Form Section */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h2 className="text-3xl font-bold text-orange-500 mb-5">Login</h2>

        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-80">
          <input
            className="w-full p-3 mb-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 mb-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg font-bold hover:bg-orange-600"
            onClick={handleLogin}
          >
            Login
          </button>

          {/* Redirect to SignUp */}
          <p className="mt-4 text-gray-300 text-center">
            Don't have an account?{" "}
            <span
              className="text-orange-500 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
