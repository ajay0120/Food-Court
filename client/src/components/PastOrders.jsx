import React from "react";
import { motion } from "framer-motion";
import { Package, Calendar, ShoppingBag, User, CheckCircle } from "lucide-react";

const PastOrders = ({ order, index }) => {
  return (
    <motion.div
      className="bg-gray-900 p-6 rounded-xl shadow-lg text-white border border-gray-700 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Package className="text-orange-400" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-orange-400">
              Order #{index + 1}
            </h3>
            <p className="text-xs text-gray-500 break-all">ID: {order._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar size={14} />
          <span className="text-sm italic">
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <User className="text-blue-400" size={16} />
        <p className="text-sm text-gray-400">User: {order.user.username}</p>
      </div>

      <div className="space-y-2 divide-y divide-gray-800">
        {order.items.map((dishes, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-orange-400" size={16} />
              <span className="text-white">{dishes.product.name || dishes._id}</span>
            </div>
            <span className="text-sm text-gray-300">Qty: {dishes.quantity}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
          <CheckCircle size={14} />
          Status: Delivered
        </div>
        <div className="text-right font-bold text-orange-400 text-lg">
          Total: ₹{order.total.toFixed(2)}
        </div>
      </div>
    </motion.div>
  );
};

export default PastOrders;
