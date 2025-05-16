import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import Avatar from "react-avatar";

function Navbar() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const { cartItems } = useCart();
    const userRole =localStorage.getItem("role");
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
            <div className="w-full flex items-center justify-between px-4 md:px-10 py-5">
                {/* Left placeholder (optional) */}
                <div className="w-1/3 flex justify-start">
                    {/* Reserved for future elements */}
                </div>

                {/* Center title */}
                <div className="w-1/3 flex justify-start lg:justify-center">
                    <h1
                        className="text-orange-500 text-2xl md:text-4xl font-bold cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        Food Court BVRIT
                    </h1>
                </div>

                {/* Right side: cart, profile, login/logout */}
                <div className="w-1/3 flex justify-end items-center gap-3">
                    <button
                        onClick={() => navigate("/cart")}
                        className="relative bg-gray-800 text-white p-2 md:p-3 rounded-full hover:bg-gray-700 cursor-pointer"
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
                                className="text-white hover:bg-gray-600 transition rounded-full cursor-pointer"
                            >
                                <Avatar
                                    color={Avatar.getRandomColor("sitebase", ["blue"])}
                                    name={username}
                                    size="40"
                                    round
                                />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm md:text-base hover:bg-red-600 transition cursor-pointer"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm md:text-base hover:bg-orange-600 transition cursor-pointer"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
