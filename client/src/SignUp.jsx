import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api/axios";
import toast from "react-hot-toast";
import GoogleLoginButton from "./components/GoogleLoginButton";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await axios.post("/auth/signup", form);

      toast.success(res.data.message || "Check your email for OTP");

      // ✅ Move to OTP verification page and pass email
      navigate("/verify-email", { state: { email: form.email } });
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      toast.error(msg);

      // Optional: better field-wise error mapping
      if (msg.toLowerCase().includes("email")) {
        setErrors({ email: msg });
      } else if (msg.toLowerCase().includes("username")) {
        setErrors({ username: msg });
      } else {
        setErrors({ general: msg });
      }
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
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>

      {/* Signup Form */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h2 className="text-4xl font-bold text-orange-500 mb-6">Sign Up</h2>
        <form onSubmit={handleSignup} className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
          <input
            className="w-full p-3 mb-1 rounded-md bg-gray-700 text-white border border-gray-600"
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

          <input
            className="w-full p-3 mb-1 rounded-md bg-gray-700 text-white border border-gray-600"
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          {errors.username && <p className="text-red-500 text-sm mb-2">{errors.username}</p>}

          <input
            className="w-full p-3 mb-1 rounded-md bg-gray-700 text-white border border-gray-600"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

          <input
            className="w-full p-3 mb-1 rounded-md bg-gray-700 text-white border border-gray-600"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

          {errors.general && <p className="text-red-500 text-sm mb-2">{errors.general}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600"
            } text-white p-3 rounded-md font-bold transition cursor-pointer mt-2`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center w-96 my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Google Signup */}
        <div className="w-96">
          <GoogleLoginButton />
        </div>
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
