import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, LogOut, UserCircle, MapPin, Calendar, Clock, CheckCircle, XCircle, Settings } from "lucide-react";
import Navbar from "./Navbar";
import Avatar from "react-avatar";
import axios from "axios";
import PersonalInfo from "./PersonalInfo";
import CurrentOrders from "./CurrentOrders";
import PastOrders from "./PastOrders";
import CancelledOrders from "./CancelledOrder";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [activeTab, setActiveTab] = useState("Personal");
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);

  const token = localStorage.getItem("token");

  const fetchCurrentOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/currentOrders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentOrders(res.data);
    } catch (error) {
      console.error("Error fetching current orders", error);
    }
  };

  const fetchPastOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/pastOrders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      setPastOrders(res.data);
    } catch (error) {
      console.error("Error fetching past orders", error);
    }
  };

  const fetchCancelledOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/cancelledOrders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Cancelled Orders", res);
      setCancelledOrders(res.data);
    } catch (error) {
      console.error("Error fetching cancelled orders", error);
    }
  };

  useEffect(() => {
    fetchCurrentOrders();
    fetchPastOrders();
    fetchCancelledOrders();
  }, []);

  const markAsDelivered = async (orderId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/orders/markAsDelivered",
        { orderId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Marked as delivered");
      await fetchCurrentOrders();
      await fetchPastOrders();
    } catch (error) {
      console.error("Error marking as delivered", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderSubSection = () => {
    switch (activeTab) {
      case "Current Orders":
        return (
          <div className="space-y-6">
            {currentOrders.length === 0 ? (
              <motion.div 
                className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md mx-auto text-center border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Clock size={48} className="mx-auto mb-4 text-orange-400" />
                <h3 className="text-lg text-gray-300 mb-2">No Current Orders</h3>
                <p className="text-sm text-gray-400">New orders will appear here when customers place them</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {currentOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <CurrentOrders
                      order={order}
                      index={index}
                      markAsDelivered={markAsDelivered}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        );
      case "Past Orders":
        return (
          <div className="space-y-6">
            {pastOrders.length === 0 ? (
              <motion.div 
                className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md mx-auto text-center border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
                <h3 className="text-lg text-gray-300 mb-2">No Past Orders</h3>
                <p className="text-sm text-gray-400">Delivered orders will appear here</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {pastOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <PastOrders order={order} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        );
      case "Cancelled Orders":
        return (
          <div className="space-y-6">
            {cancelledOrders.length === 0 ? (
              <motion.div 
                className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md mx-auto text-center border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <XCircle size={48} className="mx-auto mb-4 text-red-400" />
                <h3 className="text-lg text-gray-300 mb-2">No Cancelled Orders</h3>
                <p className="text-sm text-gray-400">Cancelled orders will appear here</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {cancelledOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <CancelledOrders order={order} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        );
      case "Personal":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PersonalInfo />
          </motion.div>
        );
      case "Address":
        return (
          <motion.div 
            className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md mx-auto text-center border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MapPin size={48} className="mx-auto mb-4 text-blue-400" />
            <h3 className="text-lg text-gray-300 mb-2">No Address Added</h3>
            <p className="text-sm text-gray-400">Add your delivery address to get started with orders</p>
          </motion.div>
        );
      case "SubscriptionInfo":
        return (
          <motion.div 
            className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md mx-auto text-center border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Calendar size={48} className="mx-auto mb-4 text-purple-400" />
            <h3 className="text-lg text-gray-300 mb-2">No Subscriptions</h3>
            <p className="text-sm text-gray-400">Subscribe to meal plans for better deals and convenience</p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex">
      {/* Sidebar */}
      <motion.div 
        className="w-64 fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 p-6 flex flex-col justify-between shadow-2xl"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h2 
            className="text-2xl font-bold mb-8 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Admin Dashboard
          </motion.h2>
          
          <div className="space-y-3">
            <motion.button
              onClick={() => {
                setActiveSection("profile");
                setActiveTab("Personal");
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeSection === "profile" 
                  ? "bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white shadow-lg transform scale-105" 
                  : "bg-gray-800/50 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:shadow-md"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <User size={20} />
              <span className="font-medium">Profile</span>
            </motion.button>
            
            <motion.button
              onClick={() => {
                setActiveSection("orders");
                setActiveTab("Current Orders");
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeSection === "orders" 
                  ? "bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white shadow-lg transform scale-105" 
                  : "bg-gray-800/50 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:shadow-md"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Package size={20} />
              <span className="font-medium">Orders</span>
            </motion.button>
          </div>
        </div>
        
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-red-600/90 to-red-700/90 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        <Navbar />
        <div className="p-8 flex-1">
          {activeSection === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Your Profile
              </h2>
              
              <div className="flex justify-center mb-8">
                <motion.div 
                  className="bg-gradient-to-r from-gray-800/80 via-gray-700/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-gray-600/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex space-x-2">
                    {[
                      { key: "Personal", icon: UserCircle, label: "Personal" },
                      { key: "Address", icon: MapPin, label: "Address" },
                      { key: "SubscriptionInfo", icon: Calendar, label: "Subscriptions" }
                    ].map(({ key, icon: Icon, label }) => (
                      <motion.button
                        key={key}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                          activeTab === key
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                            : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                        }`}
                        onClick={() => handleTabClick(key)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon size={18} />
                        <span>{label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderSubSection()}
              </motion.div>
            </motion.div>
          )}

          {activeSection === "orders" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Your Orders
              </h2>
              
              <div className="flex justify-center mb-8">
                <motion.div 
                  className="bg-gradient-to-r from-gray-800/80 via-gray-700/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-gray-600/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex space-x-2">
                    {[
                      { key: "Current Orders", icon: Clock, label: "Current" },
                      { key: "Past Orders", icon: CheckCircle, label: "Past" },
                      { key: "Cancelled Orders", icon: XCircle, label: "Cancelled" }
                    ].map(({ key, icon: Icon, label }) => (
                      <motion.button
                        key={key}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                          activeTab === key
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                            : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                        }`}
                        onClick={() => handleTabClick(key)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon size={18} />
                        <span>{label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderSubSection()}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
