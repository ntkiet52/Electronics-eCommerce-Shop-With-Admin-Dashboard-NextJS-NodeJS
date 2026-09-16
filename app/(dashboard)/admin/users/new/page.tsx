"use client";
import { DashboardSidebar } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { sanitizeFormData } from "@/lib/form-sanitize";
import apiClient from "@/lib/api";

const DashboardCreateNewUser = () => {
  const [userInput, setUserInput] = useState<{
    email: string;
    password: string;
    role: string;
  }>({
    email: "",
    password: "",
    role: "user",
  });

  const addNewUser = async () => {
    if (userInput.email === "" || userInput.password === "") {
      toast.error("You must enter all input values to add a user");
      return;
    }

    const sanitizedUserInput = sanitizeFormData(userInput);

    if (
      userInput.email.length > 3 &&
      userInput.role.length > 0 &&
      userInput.password.length > 0
    ) {
      if (!isValidEmailAddressFormat(userInput.email)) {
        toast.error("You entered invalid email address format");
        return;
      }

      if (userInput.password.length > 7) {
        try {
          const response = await apiClient.post(`/api/users`, sanitizedUserInput);
          if (response.status === 201) {
            await response.json();
            toast.success("User added successfully");
            setUserInput({
              email: "",
              password: "",
              role: "user",
            });
          } else {
            throw Error("Error while creating user");
          }
        } catch (error) {
          toast.error("Error while creating user");
        }
      } else {
        toast.error("Password must be longer than 7 characters");
      }
    } else {
      toast.error("You must enter all input values to add a user");
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 p-6 lg:p-8 w-full">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">Add New User</h1>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md max-w-xl space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              value={userInput.email}
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="At least 8 characters"
              className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              value={userInput.password}
              onChange={(e) =>
                setUserInput({ ...userInput, password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              User Role
            </label>
            <select
              className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 transition-all duration-200"
              value={userInput.role}
              onChange={(e) =>
                setUserInput({ ...userInput, role: e.target.value })
              }
            >
              <option value="admin" className="bg-slate-900 text-slate-200">admin</option>
              <option value="user" className="bg-slate-900 text-slate-200">user</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 text-sm"
              onClick={addNewUser}
            >
              Create User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateNewUser;
