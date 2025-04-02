import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const [cart, setCart] = useState([]);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  // Retrieve username from localStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clears user session
    setUsername(null);
    navigate("/login");
  };

  const menuItems = [
    { id: 1, name: "Chicken Biryani", price: 150, image: "/cb.png" },
    { id: 2, name: "Paneer Butter Masala", price: 130, image: "/paneer.png" },
    { id: 3, name: "Veg Fried Rice", price: 100, image: "/fried_rice.png" },
    { id: 4, name: "Chicken 65", price: 120, image: "/chicken65.png" },
    { id: 5, name: "Masala Dosa", price: 80, image: "/dosa.png" },
  ];

  const addToCart = (item) => {
    setCart([...cart, item]);
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center px-10 py-5">
        <button
          className="text-orange-500 text-[50px] font-bold text-center flex-1 cursor-pointer"
          onClick={() => navigate("/")}
        >
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

      <h1 className="text-orange-500 text-4xl font-bold mt-10">Menu</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-8 p-5">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 p-5 rounded-lg shadow-lg text-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-40 h-40 object-cover rounded-lg mx-auto"
            />
            <h2 className="text-xl font-bold mt-2">{item.name}</h2>
            <p className="text-gray-400 mt-1">₹{item.price}</p>
            <button
              className="bg-orange-500 text-white px-4 py-2 mt-3 rounded-lg hover:bg-orange-600"
              onClick={() => addToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
