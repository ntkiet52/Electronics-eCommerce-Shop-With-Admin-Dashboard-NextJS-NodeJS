"use client";
import { DashboardSidebar } from "@/components";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { convertCategoryNameToURLFriendly } from "../../../../../utils/categoryFormating";
import apiClient from "@/lib/api";

const DashboardNewCategoryPage = () => {
  const [categoryInput, setCategoryInput] = useState({
    name: "",
  });

  const addNewCategory = async () => {
    if (categoryInput.name.length > 0) {
      try {
        const response = await apiClient.post(`/api/categories`, {
          name: convertCategoryNameToURLFriendly(categoryInput.name),
        });

        if (response.status === 201) {
          await response.json();
          toast.success("Category added successfully");
          setCategoryInput({
            name: "",
          });
        } else {
          const errorData = await response.json();
          toast.error(
            errorData.error || "There was an error while creating category"
          );
        }
      } catch (error) {
        console.error("Error creating category:", error);
        toast.error("There was an error while creating category");
      }
    } else {
      toast.error("You need to enter values to add a category");
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 p-6 lg:p-8 w-full">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">Add New Category</h1>
        
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md max-w-xl">
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Category Name
            </label>
            <input
              type="text"
              className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              placeholder="e.g. Smart Watches"
              value={categoryInput.name}
              onChange={(e) =>
                setCategoryInput({ ...categoryInput, name: e.target.value })
              }
            />
          </div>

          <button
            type="button"
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 text-sm"
            onClick={addNewCategory}
          >
            Create Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardNewCategoryPage;
