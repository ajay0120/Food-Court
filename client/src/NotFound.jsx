import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-black via-gray-900 to-black text-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg text-center">
          404: Page not found
        </h1>
      </main>
    </div>
  );
}
