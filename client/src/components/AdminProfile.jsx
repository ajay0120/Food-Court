import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import Navbar from "./Navbar"; // adjust the import path if needed
import axios from "axios";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [activeTab, setActiveTab] = useState("Current Orders");
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/orders/all"); // Make sure this endpoint returns all orders
      const current = data.filter((order) => order.status === "Placed");
      const past = data.filter((order) => order.status === "Delivered");
      setCurrentOrders(current);
      setPastOrders(past);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrder = (order, index) => (
    <div key={order._id} className="bg-gray-800 p-4 rounded-md shadow text-white space-y-2">
      <div className="flex justify-between">
        <span className="text-lg font-semibold">Order #{index + 1}</span>
        <span className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</span>
      </div>
      <p className="text-sm text-gray-400">User: {order.user}</p>
      <div className="space-y-1">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between bg-gray-700 p-2 rounded text-sm">
            <span>{item.product?.name || item._id}</span>
            <span>Qty: {item.quantity}</span>
          </div>
        ))}
      </div>
      <p className="text-right font-semibold">Total: ₹{order.total}</p>
      {order.status === "Placed" && (
        <button
          onClick={() => markAsDelivered(order._id)}
          className="bg-green-500 px-4 py-1 mt-2 rounded hover:bg-green-600 text-white"
        >
          Mark as Delivered
        </button>
      )}
    </div>
  );

  const markAsDelivered = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}/deliver`);
      fetchOrders(); // Re-fetch orders after updating the status
    } catch (err) {
      console.error("Error updating order", err);
    }
  };

  const renderSubSection = () => {
    switch (activeTab) {
      case "Current Orders":
        return (
          <div className="space-y-4">
            {currentOrders.map(renderOrder)}
          </div>
        );
      case "Past Orders":
        return (
          <div className="space-y-4">
            {pastOrders.map(renderOrder)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex">
      {/* Sidebar */}
      <div className="w-60 fixed top-0 left-0 h-screen bg-gray-900 p-6 flex flex-col justify-between cursor-pointer">
        <div>
          <h2 className="text-2xl text-orange-500 font-bold mb-4">Admin Dashboard</h2>
          <button
            onClick={() => setActiveSection("profile")}
            className={`w-full text-left px-4 py-2 rounded-lg mb-2 ${
              activeSection === "profile" ? "bg-orange-500" : "bg-gray-800"
            } hover:bg-orange-500`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveSection("orders")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeSection === "orders" ? "bg-orange-500" : "bg-gray-800"
            } hover:bg-orange-500`}
          >
            Orders
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-60">
        <Navbar />

        <div className="p-10 flex-1">
          {activeSection === "profile" && (
            <>
              <h2 className="text-4xl font-bold text-orange-500 mb-6">Your Profile</h2>

              {/* Sub-tabs */}
              <div className="flex justify-center my-5">
                <ul className="flex space-x-8 bg-white rounded-lg p-2">
                  {["Current Orders", "Past Orders"].map((tab) => (
                    <li
                      key={tab}
                      className={`cursor-pointer transition-all duration-300 py-2 px-4 rounded-lg ${
                        activeTab === tab
                          ? "bg-orange-500 text-white font-semibold"
                          : "text-orange-500 hover:bg-blue-100 hover:text-orange-700"
                      }`}
                      onClick={() => handleTabClick(tab)}
                    >
                      {tab}
                    </li>
                  ))}
                </ul>
              </div>

              {renderSubSection()}
            </>
          )}

          {activeSection === "orders" && <div>{renderSubSection()}</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
