import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  // Get user details from localStorage
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login"); // Redirect to login page
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
          className="bg-gray-700 text-white px-4 py-2 rounded-lg absolute right-10 cursor-pointer bg-red-500 text-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Profile Details */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h2 className="text-4xl font-bold text-orange-500 mb-6">Profile</h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
          <p className="text-white text-xl mb-2"><strong>Username:</strong> {username}</p>
          <p className="text-white text-xl mb-4"><strong>Email:</strong> {email}</p>
          <button
            className="w-full bg-red-500 text-white p-3 rounded-md font-bold hover:bg-red-600 mt-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
