import React, { useState, useEffect } from "react";



const PastOrders = ({ order, index }) => {
  return (
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

      <p className="text-sm text-gray-400">User: {order.user.username}</p>

      <div className="space-y-2 divide-y divide-gray-800">
        {order.items.map((dishes, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
            <span>{dishes.product.name || dishes._id}</span>
            <span className="text-sm text-gray-300">Qty: {dishes.quantity}</span>
          </div>
        ))}
      </div>

      <div className="text-right font-bold text-orange-400 text-lg">
        Total: ₹{order.total.toFixed(2)}
      </div>
    </div>
  );
};

export default PastOrders;
