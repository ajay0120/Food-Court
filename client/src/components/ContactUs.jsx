import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ArrowLeft, Send, MessageCircle } from "lucide-react";
import Navbar from "./Navbar";

const ContactUs = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen text-white flex flex-col relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-20 relative z-10">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Contact Icon */}
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 p-8 rounded-full backdrop-blur-sm border border-orange-500/30">
                <MessageCircle size={80} className="text-orange-400" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Mail size={24} className="text-yellow-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Contact Us
          </motion.h1>

          {/* Message */}
          <motion.div
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">
              We'd Love to Hear From You!
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Our customer support system is currently being enhanced to provide you with the best 
              service experience. We're implementing new features including live chat, ticket system, 
              and multiple contact options to assist you better.
            </p>
            
            {/* Contact Info Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <Phone size={24} className="text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Phone Support</p>
                <p className="text-xs text-gray-500">Coming Soon</p>
              </div>
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <Mail size={24} className="text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Email Support</p>
                <p className="text-xs text-gray-500">Coming Soon</p>
              </div>
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <MapPin size={24} className="text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Visit Us</p>
                <p className="text-xs text-gray-500">Coming Soon</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-orange-400">
              <Clock size={20} />
              <span className="font-medium">Feature Under Development</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              onClick={() => navigate("/")}
              className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-2xl shadow-2xl overflow-hidden border border-orange-400 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-3">
                <ArrowLeft size={20} />
                Back to Home
              </span>
            </motion.button>

            <motion.button
              onClick={() => navigate("/menu")}
              className="group relative px-8 py-4 bg-gray-700/50 hover:bg-gray-600/50 text-white font-medium text-lg rounded-2xl border border-gray-600 transition-all duration-300 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <Send size={20} />
                Browse Menu
              </span>
            </motion.button>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="bg-gray-800/50 rounded-full p-4 inline-block">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span>Contact System Implementation in Progress</span>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-1000"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
