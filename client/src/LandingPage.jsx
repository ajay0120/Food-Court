import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center px-10 py-5">
      <div className="w-1/24"></div>
        <h1
          style={{ color: "#ff3d00" }}
          className="text-orange-500 text-[50px] font-bold text-center flex-grow"
        >
          Food Court BVRIT
        </h1>

        {/* Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="bg-orange-500 text-white px-5 py-2 rounded-lg text-lg hover:bg-orange-600 transition cursor-pointer"
        >
          Login
        </button>
      </div>

      
      <div className="flex space-x-10  text-[20px] p-[62px] ml-[90px] drop-shadow-xl text-center">
        {["Home", "Foods", "Today Offers", "Contact us", "About us"].map(
          (item, index) => (
            <div key={index} className="hover:text-orange-600 cursor-pointer mr-[100px]">
              {item}
            </div>
          )
        )}
      </div>

      {/* Main Section */}
      <div className="flex-grow flex flex-col justify-center items-center relative">
        {/* Centered Biriyani */}
        {/* <img src="/mb.png" className="left-0 " alt="Burger" /> */}
        <h2 style={{  color: "#808080" }} className=" text-7xl font-bold drop-shadow-xl opacity-[.67]">
          బిర్యానీ
        </h2>
        <h1 style={{  color: "#ff3d00" }} className="text-orange-500 text-6xl font-bold drop-shadow-lg -mt-3">
          Biriyani
        </h1>
        <p className="text-gray-300 mt-3">Made by Chicken, Rice, and Spices</p>

        {/* Biriyani Image */}
        <div className="mt-5 p-2 rounded-lg  ">
          <img
            src="/cb.png"
            className="w-64 rounded-lg  drop-shadow-xl"
            alt="Main Biriyani"
          />
        </div>
        {/* <div className="relative mt-5">
          <div className="absolute w-64 h-32 bg-orange-600/20 blur-3xl rounded-full -bottom-5 left-1/2 transform -translate-x-1/2"></div>
          <img
            src="/cb.png"
            className="w-64 rounded-lg shadow-[0px_10px_50px_#ff3d00] drop-shadow-2xl relative"
            alt="Main Biriyani"
          />
        </div> */}
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




