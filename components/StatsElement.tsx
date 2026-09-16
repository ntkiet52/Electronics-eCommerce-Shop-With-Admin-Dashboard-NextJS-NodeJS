// *********************
// IN DEVELOPMENT
// *********************

import React from "react";
import { FaArrowUp } from "react-icons/fa6";


const StatsElement = () => {
  return (
    <div className="flex-1 min-w-[200px] bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-cyan-400/60"></div>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
          <FaArrowUp className="text-[10px]" />
          12.5%
        </span>
      </div>
      <p className="text-3xl font-bold text-slate-100 mt-2">2,230</p>
      <p className="text-sm text-slate-400 mt-1">New Products</p>
      <p className="text-xs text-slate-600 mt-1">Since last month</p>
    </div>
  );
};

export default StatsElement;
