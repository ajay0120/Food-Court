import React, { useEffect, useState } from "react";
import axios from "axios";

const PreviousOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Placed");
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
        if (filter === "Placed") return order.status === "Placed";
        if (filter === "Past") return order.status === "Delivered";
        if (filter === "Cancelled") return order.status === "Cancelled";
        return true;
      });
      setFilteredOrders(filtered);
    };

    applyFilter();
  }, [orders, filter]);

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

  if (loading) return <p className="text-gray-300">Loading your orders...</p>;

  return (
    <div>
      <h2 className="text-4xl font-bold text-orange-500 mb-6">Your Orders</h2>

      {/* Filter Tabs */}
      <div className="mb-6 flex justify-center space-x-4">
        {["Placed", "Past", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold cursor-pointer${
              filter === status
                ? "bg-orange-500 text-white"
                : "bg-gray-700 text-orange-300 hover:bg-orange-600 hover:text-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-300">No {filter.toLowerCase()} orders found.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            <div
              key={order._id}
              className="bg-gray-900 p-6 rounded-xl shadow-md text-white border border-gray-700 space-y-4"
            >
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
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2"
                  >
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

              {order.status === "Placed" && (
                <button
                  onClick={() => handleCancel(order._id)}
                  className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviousOrders;
