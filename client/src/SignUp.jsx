import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      alert("Signup successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);
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
          onClick={() => navigate("/login")} // Navigate to Login Page
        >
          Login
        </button>
      </div>

      {/* Signup Form */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h2 className="text-4xl font-bold text-orange-500 mb-6">Sign Up</h2>
        <form className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
          <input
            className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white border border-gray-600"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white border border-gray-600"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white border border-gray-600"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-orange-500 text-white p-3 rounded-md font-bold hover:bg-orange-600 cursor-pointer"
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4">
          Already have an account?{" "}
          <span
            className="text-orange-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;

