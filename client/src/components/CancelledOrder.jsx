import React, { useState, useEffect } from "react";



const CancelledOrder = ({ order, index }) => {
  return (
    <div
      key={order._id}
      className="bg-gray-900 p-6 rounded-xl shadow-md text-white border border-red-600 space-y-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-red-400">
            Cancelled Order #{index + 1}
          </h3>
          <p className="text-xs text-gray-500 break-all">ID: {order._id}</p>
        </div>
        <span className="text-sm text-gray-400 italic">
          {new Date(order.createdAt).toLocaleString()}
        </span>
      </div>

      <p className="text-sm text-gray-400">User: {order.user.username}</p>

      <div className="space-y-2 divide-y divide-gray-800">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
            <span>{item.product?.name || item._id}</span>
            <span className="text-sm text-gray-300">Qty: {item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="text-right font-bold text-red-400 text-lg">
        Total: ₹{order.total.toFixed(2)}
      </div>

      <div className="text-sm text-gray-400">
        Payment Method: {order.paymentMethod}
      </div>

      <div className="text-sm italic text-red-500">
        Status: {order.status || "Cancelled"}
      </div>
    </div>
  );
};

export default CancelledOrder;
