import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      className="bg-gray-900 border-t border-gray-700/50 relative z-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <motion.h3
              className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              బిర్యానీ Biriyani
            </motion.h3>
            <motion.p
              className="text-gray-400 text-sm leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Crafting authentic flavors with premium ingredients and traditional recipes. 
              Your satisfaction is our commitment.
            </motion.p>
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <motion.h4
              className="text-lg font-semibold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Contact Information
            </motion.h4>
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center justify-center gap-3 text-gray-400">
                <MapPin size={16} />
                <span className="text-sm">Location coming soon</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-400">
                <Phone size={16} />
                <span className="text-sm">Phone support coming soon</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-400">
                <Mail size={16} />
                <span className="text-sm">Email support coming soon</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-400">
                <Clock size={16} />
                <span className="text-sm">24/7 Online Service</span>
              </div>
            </motion.div>
          </div>

          {/* Operating Hours */}
          <div className="text-center md:text-right">
            <motion.h4
              className="text-lg font-semibold text-white mb-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Service Hours
            </motion.h4>
            <motion.div
              className="space-y-2 text-sm text-gray-400"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div>Monday - Friday: 10:00 AM - 11:00 PM</div>
              <div>Saturday - Sunday: 10:00 AM - 12:00 AM</div>
              <div className="text-orange-400 font-medium mt-3">
                Online Ordering Available 24/7
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-700/50 mt-8 pt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-sm text-gray-400">
            © 2025 Food Court BVRIT. All rights reserved.
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
