"use client";
import React from "react";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function AdminSettingsPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col max-xl:h-fit max-xl:gap-y-4">
      <DashboardSidebar />
      <div className="w-full p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">Admin Settings</h1>
        
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md max-w-2xl space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-cyan-400">General Settings</h2>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Store Name</label>
              <input
                type="text"
                defaultValue="Singitronic Electronics Shop"
                className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Contact Email</label>
              <input
                type="email"
                defaultValue="admin@singitronic.com"
                className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Currency</label>
              <select
                defaultValue="USD"
                className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 transition-all duration-200"
              >
                <option value="USD" className="bg-slate-900">USD ($)</option>
                <option value="EUR" className="bg-slate-900">EUR (€)</option>
                <option value="VND" className="bg-slate-900">VND (₫)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-4">
            <h2 className="text-lg font-bold text-cyan-400">System Preferences</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-200">Email Notifications</p>
                <p className="text-xs text-slate-400">Receive system alerts for new orders and stock updates</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30 w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-200">Maintenance Mode</p>
                <p className="text-xs text-slate-400">Temporarily disable storefront access for customers</p>
              </div>
              <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30 w-4 h-4" />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="button"
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 text-sm"
              onClick={() => alert("Settings saved successfully!")}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
