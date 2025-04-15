// src/components/CurrentOrders.jsx
import React from "react";

const CurrentOrders = ({ order, index }) => {
  return (
    <div key={order._id} className="bg-gray-800 p-4 rounded-md shadow text-white space-y-2">
        {console.log("order",order)}
      <div className="flex justify-between">
        <span className="text-lg font-semibold">Order #{index + 1}</span>
        <span className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</span>
      </div>
      <p className="text-sm text-gray-400">User: {order.user.username}</p>
      <div className="space-y-1">
        
        {order.items.map((dishes, idx) => (
          <div key={idx} className="flex justify-between bg-gray-700 p-2 rounded text-sm">
            {console.log("dishes",dishes)}
            <span>{dishes.product.name || dishes._id}</span>
            <span>Qty: {dishes.quantity}</span>
            {/* {dishes.map((dish)=>(
                <>
                    <span>{dish.product?.name || dish._id}</span>
                    <span>Qty: {dish.quantity}</span>
                </>
            ))} */}
          </div>
        ))}
      </div>
      <p className="text-right font-semibold">Total: ₹{order.total}</p>
      {/* {order.status === "Placed" && (
        <button
          onClick={() => markAsDelivered(order._id)}
          className="bg-green-500 px-4 py-1 mt-2 rounded hover:bg-green-600 text-white"
        >
          Mark as Delivered
        </button>
      )} */}
    </div>
  );
};

export default CurrentOrders;
