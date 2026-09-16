"use client";
import { DashboardSidebar, StatsElement } from "@/components";
import React, { useEffect } from "react";
import { FaArrowUp, FaUsers, FaBoxOpen, FaMoneyBillWave } from "react-icons/fa6";

const AdminDashboardPage = () => {
  return (
    <div className="bg-slate-950 min-h-screen flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 w-full p-6 max-xl:p-4 max-xl:mt-0">
        {/* Stats Row */}
        <div className="flex gap-4 w-full max-md:flex-col">
          <StatsElement />
          <StatsElement />
          <StatsElement />
        </div>

        {/* Visitor Chart Card */}
        <div className="w-full rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-slate-800/80">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Visitors Today</h2>
                <p className="text-sm text-slate-500 mt-0.5">Compared to yesterday</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                <FaArrowUp className="text-[10px]" />
                12.5% Since last month
              </span>
            </div>
          </div>
          <div className="p-6 flex flex-col items-center justify-center h-40 gap-2">
            <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              1,200
            </p>
            <p className="text-sm text-slate-400">unique visitors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
