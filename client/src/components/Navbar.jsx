import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import Avatar from 'react-avatar';

function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const { cartItems } = useCart();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  return (
    <div className="bg-black text-white w-full">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center px-10 py-5">
        <div className="w-1/24"></div>

        <h1
          className="text-orange-500 text-[50px] font-bold text-center flex-grow cursor-pointer"
          onClick={() => navigate("/")}
        >
          Food Court BVRIT
        </h1>

        {/* Right side */}
        <div className="absolute right-10 flex items-center gap-4 cursor-pointer">
          {/* Cart Icon */}
          <button
            onClick={() => navigate("/cart")}
            className="relative bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700"
          >
            🛒
            {(cartItems?.length || 0) > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {username ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className=" text-white px-5 py-2 rounded-lg text-lg hover:bg-gray-600 transition"
              >
                <Avatar
                color={Avatar.getRandomColor("sitebase", ["blue"])}
                name={username}
                size="60"
                round
              />
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-5 py-2 rounded-lg text-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-orange-500 text-white px-5 py-2 rounded-lg text-lg hover:bg-orange-600 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      {/* <div className="flex space-x-10 text-[20px] p-[40px] ml-[90px] drop-shadow-xl text-center">
        {[
          { name: "Home", route: "/" },
          { name: "Foods", route: "/menu" },
          { name: "Today Offers", route: "#" },
          { name: "Contact us", route: "#" },
          { name: "About us", route: "#" },
        ].map((item, index) => (
          <div
            key={index}
            className="hover:text-orange-600 cursor-pointer mr-[100px]"
            onClick={() => item.route !== "#" && navigate(item.route)}
          >
            {item.name}
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default Navbar;
