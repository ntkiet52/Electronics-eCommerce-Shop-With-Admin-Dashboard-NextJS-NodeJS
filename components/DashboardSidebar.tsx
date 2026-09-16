// *********************
// Role of the component: Sidebar on admin dashboard page
// Name of the component: DashboardSidebar.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <DashboardSidebar />
// Input parameters: no input parameters
// Output: sidebar for admin dashboard page
// *********************

import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaTable } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { FaStore } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

import Link from "next/link";

const DashboardSidebar = () => {
  return (
    <div className="w-full xl:w-[320px] bg-slate-900/90 border-r border-slate-800/80 h-full min-h-screen p-4 space-y-2 backdrop-blur-xl">
      <div className="px-4 py-3 text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-slate-800/80 mb-4">
        Admin Controls
      </div>

      <Link href="/admin">
        <div className="flex gap-x-3 w-full hover:bg-slate-800/80 hover:text-cyan-400 text-slate-300 rounded-xl cursor-pointer items-center py-3.5 px-4 text-base font-semibold transition-all group">
          <MdDashboard className="text-xl text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Dashboard</span>
        </div>
      </Link>

      <Link href="/admin/orders">
        <div className="flex gap-x-3 w-full hover:bg-slate-800/80 hover:text-cyan-400 text-slate-300 rounded-xl cursor-pointer items-center py-3.5 px-4 text-base font-semibold transition-all group">
          <FaBagShopping className="text-xl text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Orders</span>
        </div>
      </Link>

      <Link href="/admin/products">
        <div className="flex gap-x-3 w-full hover:bg-slate-800/80 hover:text-cyan-400 text-slate-300 rounded-xl cursor-pointer items-center py-3.5 px-4 text-base font-semibold transition-all group">
          <FaTable className="text-xl text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Products</span>
        </div>
      </Link>

      <Link href="/admin/bulk-upload">
        <div className="flex gap-x-3 w-full hover:bg-slate-800/80 hover:text-cyan-400 text-slate-300 rounded-xl cursor-pointer items-center py-3.5 px-4 text-base font-semibold transition-all group">
          <FaFileUpload className="text-xl text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Bulk Upload</span>
        </div>
      </Link>

      <Link href="/admin/categories">
        <div className="flex gap-x-3 w-full hover:bg-slate-800/80 hover:text-cyan-400 text-slate-300 rounded-xl cursor-pointer items-center py-3.5 px-4 text-base font-semibold transition-all group">
          <MdCategory className="text-xl text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Categories</span>
        </div>
      </Link>

      <Link href="/admin/users">
        <div className="flex gap-x-3 w-full hover:bg-slate-800/80 hover:text-cyan-400 text-slate-300 rounded-xl cursor-pointer items-center py-3.5 px-4 text-base font-semibold transition-all group">
          <FaRegUser className="text-xl text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Users</span>
        </div>
      </Link>

      <Link href="/admin/merchant">
        <div className="flex gap-x-3 w-full hover:bg-slate-800/80 hover:text-cyan-400 text-slate-300 rounded-xl cursor-pointer items-center py-3.5 px-4 text-base font-semibold transition-all group">
          <FaStore className="text-xl text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Merchant</span>
        </div>
      </Link>

      <Link href="/admin/settings">
        <div className="flex gap-x-3 w-full hover:bg-slate-800/80 hover:text-cyan-400 text-slate-300 rounded-xl cursor-pointer items-center py-3.5 px-4 text-base font-semibold transition-all group">
          <FaGear className="text-xl text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Settings</span>
        </div>
      </Link>
    </div>
  );
};

export default DashboardSidebar;
