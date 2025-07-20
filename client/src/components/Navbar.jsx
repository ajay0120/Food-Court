import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, LogOut } from "lucide-react";
import { useCart } from "../context/cartContext";
import Avatar from "react-avatar";

function Navbar() {
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const [username, setUsername] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        refreshUserData();
    }, []);

    // Listen for storage changes (cross-tab sync)
    useEffect(() => {
        const handleStorageChange = () => refreshUserData();
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const refreshUserData = () => {
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");
        console.log("🔄 Refreshing user data - Username:", username, "Role:", role);
        setUsername(username);
        setUserRole(role);
    };

    const handleLogout = () => {
        localStorage.clear();
        setUsername(null);
        setUserRole(null);
        navigate("/login");
    };

    const handleProfileNavigation = () => {
        const currentUsername = localStorage.getItem("username");
        const currentRole = localStorage.getItem("role");
        const currentToken = localStorage.getItem("token");

        console.log("=== Profile Navigation Debug ===");
        console.log("Username:", currentUsername);
        console.log("Role:", currentRole);
        console.log("Token exists:", !!currentToken);
        console.log("Token value:", currentToken?.substring(0, 20) + "...");
        console.log("Current URL:", window.location.href);

        if (!currentUsername || !currentToken) {
            console.log("❌ Missing username or token, redirecting to login");
            alert("Please login first");
            navigate("/login");
            return;
        }

        if (currentRole?.toLowerCase() === "admin") {
            console.log("✅ Admin user, navigating to /admin");
            navigate("/admin");
        } else {
            console.log("✅ Regular user, navigating to /profile");
            navigate("/profile");
        }
        console.log("=== Navigation attempt completed ===");
    };

    return (
        <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white w-full shadow-2xl border-b border-gray-800">
            {console.log("🎯 Navbar render - Username:", username, "UserRole:", userRole)}
            <div className="w-full flex items-center justify-between px-4 md:px-10 py-6">
                <div className="w-1/3 flex justify-start" />

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

                <div className="w-1/3 flex justify-end items-center gap-3">
                    <motion.button
                        onClick={() => navigate("/cart")}
                        className="relative bg-gradient-to-r from-gray-800 to-gray-700 text-white p-2.5 md:p-3 rounded-full hover:from-orange-600 hover:to-orange-500 transition-all duration-300 cursor-pointer shadow-lg group"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ShoppingCart size={20} className="group-hover:scale-110 transition-transform duration-300" />
                        {(cartItems?.length || 0) > 0 && (
                            <motion.span
                                className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full px-1.5 py-0.5 text-xs font-bold shadow-lg min-w-[18px] h-[18px] flex items-center justify-center"
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
                                onClick={(e) => {
                                    console.log("🖱️ Avatar button clicked!");
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleProfileNavigation();
                                }}
                                className="text-white hover:scale-110 transition-transform duration-300 rounded-full cursor-pointer shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ pointerEvents: 'auto', zIndex: 10 }}
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
                                className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white px-5 py-2.5 rounded-xl text-sm md:text-base hover:from-red-600 hover:via-red-700 hover:to-red-800 transition-all duration-300 cursor-pointer shadow-lg font-semibold border border-red-400/30 hover:border-red-300/50 hover:shadow-red-500/25 hover:shadow-xl backdrop-blur-sm flex items-center gap-2"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LogOut size={16} />
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
