import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import Navbar from "./Navbar"; // adjust the import path if needed
import PersonalInfo from "./PersonalInfo";
import PreviousOrders from "./PreviousOrders";

const Profile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [activeTab, setActiveTab] = useState("Personal");

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

  const renderSubSection = () => {
    switch (activeTab) {
      case "Personal":
        return (
            <PersonalInfo/>
        );
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
          <h2 className="text-2xl text-orange-500 font-bold mb-4">Account</h2>
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
            Previous Orders
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
              <h2 className="text-4xl font-bold text-orange-500 mb-6">
                Your Profile
              </h2>

              {/* Sub-tabs */}
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

          {activeSection === "orders" && <PreviousOrders />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
