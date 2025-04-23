import React, { useEffect, useState } from "react";
import axios from "axios";

const PreviousOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p className="text-gray-300">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-gray-300">No previous orders found.</p>;
  }

  return (
    <div>
      <h2 className="text-4xl font-bold text-orange-500 mb-6">Your Orders</h2>
      <div className="space-y-6">
        {console.log(orders)}
        {orders.map((order, index) => (
          <div
            key={order._id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-white"
          >
            <h3 className="text-xl font-semibold mb-2">
              Order #{index + 1} -{" "}
              <span className="text-sm text-gray-400">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded"
                >
                  <div>
                    <p className="text-orange-400 font-semibold">
                      {item.product?.name || "Item not found"}
                    </p>
                    <p className="text-sm text-gray-300">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">
                      ₹{item.product?.price.org.toFixed(2) || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right font-bold text-orange-400">
              Total: ₹{order.total.toFixed(2)}
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Payment Method: {order.paymentMethod}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousOrders;
