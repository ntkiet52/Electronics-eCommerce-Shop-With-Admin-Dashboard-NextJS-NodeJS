"use client";
import { DashboardSidebar } from "@/components";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { formatCategoryName } from "../../../../../utils/categoryFormating";
import { convertCategoryNameToURLFriendly } from "../../../../../utils/categoryFormating";
import apiClient from "@/lib/api";

interface DashboardSingleCategoryProps {
  params: Promise<{ id: string }>;
}

const DashboardSingleCategory = ({ params }: DashboardSingleCategoryProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [categoryInput, setCategoryInput] = useState<{ name: string }>({
    name: "",
  });
  const router = useRouter();

  const deleteCategory = async () => {
    const requestOptions = {
      method: "DELETE",
    };
    apiClient
      .delete(`/api/categories/${id}`, requestOptions)
      .then((response) => {
        if (response.status === 204) {
          toast.success("Category deleted successfully");
          router.push("/admin/categories");
        } else {
          throw Error("There was an error deleting a category");
        }
      })
      .catch((error) => {
        toast.error("There was an error deleting category");
      });
  };

  const updateCategory = async () => {
    if (categoryInput.name.length > 0) {
      try {
        const response = await apiClient.put(`/api/categories/${id}`, {
          name: convertCategoryNameToURLFriendly(categoryInput.name),
        });

        if (response.status === 200) {
          await response.json();
          toast.success("Category successfully updated");
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Error updating a category");
        }
      } catch (error) {
        console.error("Error updating category:", error);
        toast.error("There was an error while updating a category");
      }
    } else {
      toast.error("For updating a category you must enter all values");
      return;
    }
  };

  useEffect(() => {
    apiClient
      .get(`/api/categories/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategoryInput({
          name: data?.name,
        });
      });
  }, [id]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 p-6 lg:p-8 w-full">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">Category Details</h1>
        
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md max-w-xl">
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Category Name
            </label>
            <input
              type="text"
              className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              value={formatCategoryName(categoryInput.name)}
              onChange={(e) =>
                setCategoryInput({ ...categoryInput, name: e.target.value })
              }
            />
          </div>

          <div className="flex gap-x-3 max-sm:flex-col gap-y-3">
            <button
              type="button"
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 text-sm"
              onClick={updateCategory}
            >
              Update Category
            </button>
            <button
              type="button"
              className="px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold rounded-xl transition-all duration-200 text-sm"
              onClick={deleteCategory}
            >
              Delete Category
            </button>
          </div>
          
          <p className="mt-4 text-xs text-rose-400/80 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
            <strong>Note:</strong> Deleting this category will also remove all associated products.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSingleCategory;
