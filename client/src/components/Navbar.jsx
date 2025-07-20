import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/cartContext";
import Avatar from "react-avatar";

function Navbar() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const { cartItems } = useCart();
    const [userRole, setUserRole] = useState(null);
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
        const storedRole = localStorage.getItem("role");
        if (storedRole) {
            setUserRole(storedRole);
            }
        }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUsername(null);
        setUserRole(null);
        navigate("/login");
    };

    return (
        <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white w-full shadow-2xl border-b border-gray-800">
            {/* Top bar */}
            <div className="w-full flex items-center justify-between px-4 md:px-10 py-6">
                {/* Left placeholder (optional) */}
                <div className="w-1/3 flex justify-start">
                    {/* Reserved for future elements */}
                </div>

                {/* Center title */}
                <motion.div 
                    className="w-1/3 flex justify-start lg:justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1
                        className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent text-2xl md:text-4xl font-bold cursor-pointer hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                        onClick={() => navigate("/")}
                    >
                        Food Court BVRIT
                    </h1>
                </motion.div>

                {/* Right side: cart, profile, login/logout */}
                <div className="w-1/3 flex justify-end items-center gap-4">
                    <motion.button
                        onClick={() => navigate("/cart")}
                        className="relative bg-gradient-to-r from-gray-800 to-gray-700 text-white p-3 md:p-4 rounded-full hover:from-orange-600 hover:to-orange-500 transition-all duration-300 cursor-pointer shadow-lg group"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">🛒</span>
                        {(cartItems?.length || 0) > 0 && (
                            <motion.span 
                                className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full px-2 py-1 text-xs font-bold shadow-lg"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                            >
                                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                            </motion.span>
                        )}
                    </motion.button>

                    {username ? (
                        <>
                            <motion.button
                                onClick={() =>
                                    {
                                        if(userRole!=="admin") {
                                            navigate("/profile")
                                        }
                                        else{
                                            navigate("/admin");
                                        }
                                    }
                                }
                                className="text-white hover:scale-110 transition-transform duration-300 rounded-full cursor-pointer shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Avatar
                                    color={Avatar.getRandomColor("sitebase", ["blue"])}
                                    name={username}
                                    size="45"
                                    round
                                />
                            </motion.button>
                            <motion.button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm md:text-base hover:from-red-600 hover:to-red-700 transition-all duration-300 cursor-pointer shadow-lg font-medium"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Logout
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            onClick={() => navigate("/login")}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg text-sm md:text-base hover:from-orange-600 hover:to-orange-700 transition-all duration-300 cursor-pointer shadow-lg font-medium"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Login
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
