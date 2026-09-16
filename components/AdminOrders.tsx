"use client";

// *********************
// Role of the component: Component that displays all orders on admin dashboard page
// Name of the component: AdminOrders.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <AdminOrders />
// Input parameters: No input parameters
// Output: Table with all orders
// *********************

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await apiClient.get("/api/orders");
      const data = await response.json();
      
      setOrders(data?.orders);
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "pending": return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      case "cancelled": return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
      default: return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    }
  };

  return (
    <div className="xl:ml-5 w-full max-xl:mt-5">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">All Orders</h1>
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="py-4 px-4 text-left">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 accent-cyan-500" />
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order?.id} className="hover:bg-slate-800/40 transition-colors duration-150">
                  <td className="py-4 px-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 accent-cyan-500" />
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-slate-300 font-medium">#{order?.id?.slice(0, 8)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-slate-200">{order?.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{order?.country}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order?.status)}`}>
                      {order?.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-slate-200 font-semibold">${order?.total}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-slate-400 text-xs">{new Date(Date.parse(order?.dateTime)).toDateString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Link
                      href={`/admin/orders/${order?.id}`}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
