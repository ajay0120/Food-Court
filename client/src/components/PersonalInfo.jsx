import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Tag, Mail, BarChart3, Calendar, Package, CheckCircle } from "lucide-react";
import Avatar from "react-avatar";
import axios from "../api/axios";

function PersonalInfo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [stats, setStats] = useState({
    memberSince: "Loading...",
    totalOrders: "...",
    accountStatus: "Active"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setStatus("loading");
      const { data } = await axios.get("/users/profile");
      setUser(data);
      setStatus("success");
    } catch (error) {
      console.error("Failed to fetch profile", error);
      setUser(null);

      if (error.response?.status === 401) {
        setStatus("unauthorized");
        return;
      }

      if (error.response?.status === 429) {
        setStatus("rate_limited");
        return;
      }

      setStatus("error");
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await axios.get("/users/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setStats({
        memberSince: "Recently",
        totalOrders: "0",
        accountStatus: "Active"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-r from-black via-gray-900 to-black text-white">
        <div className="flex items-center justify-center mb-4">
          <svg className="animate-spin h-10 w-10 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
        <div className="text-lg font-semibold">Loading profile...</div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div className="flex justify-center items-start py-8">
        <div className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-800/80 p-8 text-center text-white shadow-2xl">
          <h2 className="text-2xl font-semibold mb-3">Please log in to view your profile</h2>
          <p className="text-gray-300 mb-6">Your session may have expired. Sign in again to access your account details.</p>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 font-medium text-white transition hover:from-orange-600 hover:to-orange-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (status === "rate_limited") {
    return (
      <div className="flex justify-center items-start py-8">
        <div className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-800/80 p-8 text-center text-white shadow-2xl">
          <h2 className="text-2xl font-semibold mb-3">Too many requests</h2>
          <p className="text-gray-300">Please wait a bit before trying to load your personal information again.</p>
        </div>
      </div>
    );
  }

  if (status === "error" || !user) {
    return (
      <div className="flex justify-center items-start py-8">
        <div className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-800/80 p-8 text-center text-white shadow-2xl">
          <h2 className="text-2xl font-semibold mb-3">Something went wrong</h2>
          <p className="text-gray-300">We couldn&apos;t load your personal information right now. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start py-8">
      <motion.div
        className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 px-8">
          <div className="flex items-center space-x-4">
            <Avatar
              color={Avatar.getRandomColor("sitebase", ["blue"])}
              name={user.username}
              size="70"
              round={true}
            />
            <div>
              <h1 className="text-2xl font-bold">Personal Information</h1>
              <p className="text-orange-100 mt-1">Manage your account details</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* User Summary */}
          <motion.div
            className="flex items-center space-x-6 mb-8 p-4 bg-gray-700/30 rounded-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Avatar
              color={Avatar.getRandomColor("sitebase", ["blue"])}
              name={user.username}
              size="80"
              round={true}
            />
            <div>
              <h2 className="text-2xl font-semibold text-white">{user.name}</h2>
              <p className="text-gray-400 text-lg">{user.email}</p>
              <p className="text-orange-400 text-sm mt-1">@{user.username}</p>
            </div>
          </motion.div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <motion.div
              className="mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-gray-300 mb-3 font-medium flex items-center gap-2">
                <User size={18} className="text-orange-400" /> Full Name
              </h3>
              <div className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-4 text-white font-medium hover:border-orange-500/50 transition-colors duration-300">
                {user.name}
              </div>
            </motion.div>

            {/* Username */}
            <motion.div
              className="mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-gray-300 mb-3 font-medium flex items-center gap-2">
                <Tag size={18} className="text-blue-400" /> Username
              </h3>
              <div className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-4 text-white font-medium hover:border-orange-500/50 transition-colors duration-300">
                {user.username}
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              className="mb-5 md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-gray-300 mb-3 font-medium flex items-center gap-2">
                <Mail size={18} className="text-green-400" /> Email Address
              </h3>
              <div className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-4 text-white font-medium hover:border-orange-500/50 transition-colors duration-300">
                {user.email}
              </div>
            </motion.div>
          </div>

          {/* Account Stats */}
          <motion.div
            className="mt-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-purple-400" /> Account Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <Calendar size={20} className="mx-auto mb-2 text-blue-400" />
                <p className="text-gray-400 text-sm">Member Since</p>
                <p className="text-white font-semibold">
                  {loading ? "Loading..." : stats.memberSince}
                </p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <Package size={20} className="mx-auto mb-2 text-orange-400" />
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-white font-semibold">
                  {loading ? "..." : stats.totalOrders}
                </p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <CheckCircle size={20} className="mx-auto mb-2 text-green-400" />
                <p className="text-gray-400 text-sm">Account Status</p>
                <span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {stats.accountStatus}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default PersonalInfo;
