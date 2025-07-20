import React, { useEffect, useState } from "react";
import axios from "axios";
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
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center">
                <p className="text-lg text-gray-300">No Placed Orders yet.</p>
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <OrderCard
                  order={order}
                  index={index}
                  key={order._id}
                  handleCancel={handleCancel}
                  showCancel={true}
                />
              ))
            )}
          </div>
        );
      case "Past":
        return (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center">
                <p className="text-lg text-gray-300">No Past Orders yet.</p>
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <OrderCard
                  order={order}
                  index={index}
                  key={order._id}
                  showCancel={false}
                />
              ))
            )}
          </div>
        );
      case "Cancelled":
        return (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center">
                <p className="text-lg text-gray-300">No Cancelled Orders yet.</p>
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <OrderCard
                  order={order}
                  index={index}
                  key={order._id}
                  showCancel={false}
                />
              ))
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const OrderCard = ({ order, index, handleCancel, showCancel }) => (
    <div className="bg-gray-900 p-6 rounded-xl shadow-md text-white border border-gray-700 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-orange-400">
            Order #{index + 1}
          </h3>
          <p className="text-xs text-gray-500 break-all">ID: {order._id}</p>
        </div>
        <span className="text-sm text-gray-400 italic">
          {new Date(order.createdAt).toLocaleString()}
        </span>
      </div>
      <div className="space-y-2 divide-y divide-gray-800">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
            <div>
              <p className="text-orange-400 font-semibold">
                {item.product?.name || "Item not found"}
              </p>
              <p className="text-sm text-gray-300">
                Quantity: {item.quantity}
              </p>
            </div>
            <p className="text-sm text-gray-300">
              ₹{item.product?.price?.org.toFixed(2) || 0}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-2 text-right font-bold text-orange-400 text-lg">
        Total: ₹{order.total.toFixed(2)}
      </div>
      <div className="text-sm text-gray-400">
        Payment Method: {order.paymentMethod}
      </div>
      <div className="text-sm text-gray-400">
        Status: {order.status}
      </div>
      {showCancel && handleCancel && (
        <button
          onClick={() => handleCancel(order._id)}
          className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer"
        >
          Cancel Order
        </button>
      )}
    </div>
  );

  if (loading) return <p className="text-gray-300">Loading your orders...</p>;

  return (
    <>

      <h2 className="text-4xl font-bold text-orange-500 mb-6">Your Orders</h2>
      {/* Filter Tabs */}
      <div className="flex justify-center my-5">
        <ul className="flex space-x-8 bg-white rounded-lg p-2">
          {["Placed", "Past", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg  cursor-pointer transition-all duration-300 ${activeTab === tab
                ? "bg-orange-500 text-white font-semibold"
                : "text-orange-500 hover:bg-blue-100 hover:text-orange-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </ul>
      </div>
      {renderSubSection()}
    </>
  );
};

export default PreviousOrders;
