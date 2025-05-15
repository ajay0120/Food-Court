import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
          <div className="space-y-4">
            {currentOrders.length === 0 ? (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center">
                <p className="text-lg text-gray-300">No Current Orders yet.</p>
              </div>
            ) : (
              currentOrders.map((order, index) => (
                <CurrentOrders
                  order={order}
                  index={index}
                  key={order._id}
                  markAsDelivered={markAsDelivered}
                />
              ))
            )}
          </div>
        );
      case "Past Orders":
        return (
          <div className="space-y-4">
            {pastOrders.length === 0 ? (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center">
                <p className="text-lg text-gray-300">No Past Orders yet.</p>
              </div>
            ) : (
              pastOrders.map((order, index) => (
                <PastOrders order={order} index={index} key={order._id} />
              ))
            )}
          </div>
        );
      case "Cancelled Orders":
        return (
          <div className="space-y-4">
            {cancelledOrders.length === 0 ? (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center">
                <p className="text-lg text-gray-300">No Cancelled Orders yet.</p>
              </div>
            ) : (
              cancelledOrders.map((order, index) => (
                <CancelledOrders order={order} index={index} key={order._id} />
              ))
            )}
          </div>
        );
      case "Personal":
        return <PersonalInfo />;
      case "Address":
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center">
            <p className="text-lg text-gray-300">No address added yet.</p>
          </div>
        );
      case "SubscriptionInfo":
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center">
            <p className="text-lg text-gray-300">No subscriptions found.</p>
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
            onClick={() => {
              setActiveSection("profile");
              setActiveTab("Personal");
            }}
            className={`w-full text-left px-4 py-2 rounded-lg mb-2 cursor-pointer ${
              activeSection === "profile" ? "bg-orange-500" : "bg-gray-800"
            } hover:bg-orange-500`}
          >
            Profile
          </button>
          <button
            onClick={() => {
              setActiveSection("orders");
              setActiveTab("Current Orders");
            }}
            className={`w-full text-left px-4 py-2 rounded-lg cursor-pointer ${
              activeSection === "orders" ? "bg-orange-500" : "bg-gray-800"
            } hover:bg-orange-500`}
          >
            Orders
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-60">
        <Navbar />
        <div className="p-10 flex-1">
          {activeSection === "profile" && (
            <>
              <h2 className="text-4xl font-bold text-orange-500 mb-6">Your Profile</h2>
              <div className="flex justify-center my-5">
                <ul className="flex space-x-8 bg-white rounded-lg p-2">
                  {["Personal", "Address", "SubscriptionInfo"].map((tab) => (
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

          {activeSection === "orders" && (
            <>
              <h2 className="text-4xl font-bold text-orange-500 mb-6">Your Orders</h2>
              <div className="flex justify-center my-5">
                <ul className="flex space-x-8 bg-white rounded-lg p-2">
                  {["Current Orders", "Past Orders", "Cancelled Orders"].map((tab) => (
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
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
