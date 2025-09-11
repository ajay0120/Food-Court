import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, LogOut, UserCircle, MapPin, Calendar } from "lucide-react";
import Avatar from "react-avatar";
import Navbar from "./Navbar"; 
import PersonalInfo from "./PersonalInfo";
import PreviousOrders from "./PreviousOrders";
import axios from '../api/axios'; 

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State to hold user data from API
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [activeSection, setActiveSection] = useState("profile");
  const [activeTab, setActiveTab] = useState("Personal");

  // Fetch profile data from the API when the component loads
  useEffect(() => {
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

    fetchProfile();
  }, []);


  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Render a loading state
  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  // Render if user data failed to load
  if (!user) {
    return <div>Could not load profile. Please try logging in again.</div>;
  }

  const renderSubSection = () => {
    switch (activeTab) {
      case "Personal":
        return <PersonalInfo />;
      case "Address":
        return (
          <motion.div 
            className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-xl max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-300 mb-2">No address added yet</p>
            <p className="text-sm text-gray-400">Add your delivery address to get started</p>
          </motion.div>
        );
      case "SubscriptionInfo":
        return (
          <motion.div 
            className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-xl max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-300 mb-2">No subscriptions found</p>
            <p className="text-sm text-gray-400">Subscribe to meal plans for better deals</p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white min-h-screen flex relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Sidebar */}
      <div className="w-60 fixed top-0 left-0 h-screen bg-gray-900/90 backdrop-blur-sm border-r border-gray-700 p-6 flex flex-col justify-between cursor-pointer z-20">
        <div>
          <motion.h2 
            className="text-2xl bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent font-bold mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            Account
          </motion.h2>
          <motion.button
            onClick={() => setActiveSection("profile")}
            className={`w-full text-left px-4 py-3 rounded-xl mb-3 cursor-pointer transition-all duration-300 flex items-center gap-3 ${
              activeSection === "profile" 
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                : "bg-gray-800/50 hover:bg-orange-500/20 hover:border-orange-500/50 border border-gray-700"
            }`}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <User size={18} />
            Profile
          </motion.button>
          <motion.button
            onClick={() => setActiveSection("orders")}
            className={`w-full text-left px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 flex items-center gap-3 ${
              activeSection === "orders" 
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                : "bg-gray-800/50 hover:bg-orange-500/20 hover:border-orange-500/50 border border-gray-700"
            }`}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Package size={18} />
            Previous Orders
          </motion.button>
        </div>
        <motion.button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 cursor-pointer shadow-lg flex items-center gap-3"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-60 relative z-10">
        <Navbar />

        <div className="p-10 flex-1">
          {activeSection === "profile" && (
            <>
              <motion.h2 
                className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Your Profile
              </motion.h2>

              {/* Sub-tabs */}
              <motion.div 
                className="flex justify-center my-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <ul className="flex space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700">
                  {[
                    { key: "Personal", label: "Personal", icon: UserCircle },
                    { key: "Address", label: "Address", icon: MapPin },
                    { key: "SubscriptionInfo", label: "Subscriptions", icon: Calendar }
                  ].map((tab) => (
                    <li
                      key={tab.key}
                      className={`cursor-pointer transition-all duration-300 py-3 px-6 rounded-xl font-medium ${
                        activeTab === tab.key
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      }`}
                      onClick={() => handleTabClick(tab.key)}
                    >
                      <span className="flex items-center gap-2">
                        <tab.icon size={16} />
                        {tab.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {renderSubSection()}
              </motion.div>
            </>
          )}
          
          {activeSection === "orders" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <PreviousOrders />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
