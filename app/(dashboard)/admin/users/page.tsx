"use client";
import { CustomButton, DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const DashboardUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // sending API request for all users
    apiClient.get("/api/users")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUsers(data);
      });
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col max-xl:h-fit max-xl:gap-y-4">
      <DashboardSidebar />
      <div className="w-full p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">
            All Users
          </h1>
          <Link
            href="/admin/users/new"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-cyan-500/20"
          >
            Add new user
          </Link>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          <div className="overflow-x-auto max-h-[75vh]">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs font-semibold text-slate-400 uppercase tracking-wider sticky top-0 backdrop-blur-md border-b border-slate-800">
                <tr>
                  <th className="p-4 w-12 text-center">
                    <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30" />
                  </th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users &&
                  users.map((user) => (
                    <tr key={nanoid()} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 text-center">
                        <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30" />
                      </td>
                      <td className="p-4 font-medium text-slate-200">
                        {user?.email}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user?.role === "admin"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}>
                          {user?.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/users/${user?.id}`}
                          className="px-3 py-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg border border-cyan-500/20 transition-all"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUsers;
