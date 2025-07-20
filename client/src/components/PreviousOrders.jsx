import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Package, Calendar, CreditCard, ShoppingBag } from "lucide-react";
import { ORDER_STATUSES } from "../../../common/orderEnums";

const PreviousOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Placed");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders/myorders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  useEffect(() => {
    const applyFilter = () => {
      const filtered = orders.filter((order) => {
        if (activeTab === "Placed") return order.status === ORDER_STATUSES[0]; // "Placed"
        if (activeTab === "Past") return order.status === ORDER_STATUSES[1]; // "Delivered"
        if (activeTab === "Cancelled") return order.status === ORDER_STATUSES[2]; // "Cancelled"
        return true;
      });
      setFilteredOrders(filtered);
    };

    applyFilter();
  }, [orders, activeTab]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.put(
        `http://localhost:5000/api/orders/cancel/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the order status in the UI
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "Cancelled" } : o
        )
      );
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Could not cancel the order. Please try again.");
    }
  };

  const renderSubSection = () => {
    switch (activeTab) {
      case "Placed":
        return (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <motion.div 
                className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md mx-auto text-center border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Clock size={48} className="mx-auto mb-4 text-orange-400" />
                <h3 className="text-lg text-gray-300 mb-2">No Placed Orders</h3>
                <p className="text-sm text-gray-400">You haven't placed any orders yet</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <OrderCard
                      order={order}
                      index={index}
                      handleCancel={handleCancel}
                      showCancel={true}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        );
      case "Past":
        return (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <motion.div 
                className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md mx-auto text-center border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
                <h3 className="text-lg text-gray-300 mb-2">No Past Orders</h3>
                <p className="text-sm text-gray-400">Your delivered orders will appear here</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <OrderCard
                      order={order}
                      index={index}
                      showCancel={false}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        );
      case "Cancelled":
        return (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <motion.div 
                className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md mx-auto text-center border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <XCircle size={48} className="mx-auto mb-4 text-red-400" />
                <h3 className="text-lg text-gray-300 mb-2">No Cancelled Orders</h3>
                <p className="text-sm text-gray-400">Your cancelled orders will appear here</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <OrderCard
                      order={order}
                      index={index}
                      showCancel={false}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const OrderCard = ({ order, index, handleCancel, showCancel }) => {
    // Determine border color based on order status
    const getBorderColor = () => {
      if (order.status === 'Cancelled') return 'border-red-600';
      return 'border-gray-700';
    };

    return (
      <motion.div 
        className={`bg-gray-900 p-6 rounded-xl shadow-lg text-white border ${getBorderColor()} space-y-4`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02, y: -2 }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Package className={`${order.status === 'Cancelled' ? 'text-red-400' : 'text-orange-400'}`} size={20} />
            <div>
              <h3 className={`text-lg font-semibold ${order.status === 'Cancelled' ? 'text-red-400' : 'text-orange-400'}`}>
                {order.status === 'Cancelled' ? `Cancelled Order #${index + 1}` : `Order #${index + 1}`}
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
        
        <div className="space-y-2 divide-y divide-gray-800">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-orange-400" size={16} />
                <div>
                  <p className="text-white font-medium">
                    {item.product?.name || "Item not found"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="text-orange-400 font-semibold">
                ₹{item.product?.price?.org.toFixed(2) || 0}
              </p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-2">
            <CreditCard className="text-blue-400" size={16} />
            <span className="text-sm text-gray-400">
              {order.paymentMethod}
            </span>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${order.status === 'Cancelled' ? 'text-red-400' : 'text-orange-400'}`}>
              Total: ₹{order.total.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            order.status === 'Placed' ? 'bg-orange-500/20 text-orange-400' :
            order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {order.status === 'Placed' && <Clock size={14} />}
            {order.status === 'Delivered' && <CheckCircle size={14} />}
            {order.status === 'Cancelled' && <XCircle size={14} />}
            Status: {order.status}
          </div>
          
          {showCancel && handleCancel && (
            <motion.button
              onClick={() => handleCancel(order._id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 font-medium shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel Order
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <motion.div
        className="text-gray-300 text-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Loading your orders...
      </motion.div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
        Your Orders
      </h2>
      
      {/* Filter Tabs */}
      <div className="flex justify-center mb-8">
        <motion.div 
          className="bg-gradient-to-r from-gray-800/80 via-gray-700/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-gray-600/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex space-x-2">
            {[
              { key: "Placed", icon: Clock, label: "Placed" },
              { key: "Past", icon: CheckCircle, label: "Past" },
              { key: "Cancelled", icon: XCircle, label: "Cancelled" }
            ].map(({ key, icon: Icon, label }) => (
              <motion.button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                  activeTab === key
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={18} />
                <span>{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
      
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderSubSection()}
      </motion.div>
    </motion.div>
  );
};

export default PreviousOrders;
