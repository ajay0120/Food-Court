import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Tag, Mail, BarChart3, Calendar, Package, CheckCircle } from "lucide-react";
import Avatar from "react-avatar";
import axios from "../api/axios";

function PersonalInfo() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      const { data } = await axios.get("/users/profile");
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
      // Optional: handle error, e.g., redirect to login if unauthorized
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
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

  // Render a loading state
  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  // Render if user data failed to load
  if (!user) {
    return <div>Could not load profile. Please try logging in again.</div>;
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
