import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.clear(); // Clears all stored data
    setUsername(null);
    navigate("/login");
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center px-10 py-5">
      <button className="text-orange-500 text-[50px] font-bold text-center flex-1 cursor-pointer"
          onClick={() => navigate("/")}>
          Food Court BVRIT
        </button>

        {/* Login or Profile Section */}
        <div className="absolute right-10">
          {username ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="bg-gray-700 text-white px-5 py-2 rounded-lg text-lg hover:bg-gray-600 transition cursor-pointer"
              >
                {username}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-5 py-2 rounded-lg text-lg hover:bg-red-600 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-orange-500 text-white px-5 py-2 rounded-lg text-lg hover:bg-orange-600 transition cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex flex-wrap justify-center gap-10 text-[20px] p-[40px] drop-shadow-xl text-center">
        {["Home", "Foods", "Today Offers", "Contact us", "About us"].map(
          (item, index) => (
            <div key={index} className="hover:text-orange-600 cursor-pointer">
              {item}
            </div>
          )
        )}
      </div>

      {/* Main Section */}
      <div className="flex-grow flex flex-col justify-center items-center">
        <h2 className="text-7xl font-bold drop-shadow-xl opacity-70 text-gray-400">
          బిర్యానీ
        </h2>
        <h1 className="text-orange-500 text-6xl font-bold drop-shadow-lg -mt-3">
          Biriyani
        </h1>
        <p className="text-gray-300 mt-3">Made with Chicken, Rice, and Spices</p>

        {/* Biriyani Image */}
        <div className="mt-5 p-2 rounded-lg">
          <img
            src="/cb.png"
            className="w-64 rounded-lg drop-shadow-xl"
            alt="Main Biriyani"
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex space-x-5 mt-5 mb-10">
        <button className="bg-gray-700 p-4 rounded-full hover:bg-gray-600">
          ⬅
        </button>
        <button className="bg-gray-700 p-4 rounded-full hover:bg-gray-600">
          ➡
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
