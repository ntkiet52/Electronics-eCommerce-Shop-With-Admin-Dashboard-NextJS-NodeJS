"use client";
import React, { useEffect, useState, use } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  price: number;
  inStock: number;
}

interface Merchant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  status: string;
  products: Product[];
}

interface MerchantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MerchantDetailPage({
  params,
}: MerchantDetailPageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    status: "ACTIVE",
  });

  const router = useRouter();

  const fetchMerchant = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/merchants/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/admin/merchant");
          return;
        }
        throw new Error("Failed to fetch merchant");
      }
      
      const data = await response.json();
      setMerchant(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        description: data.description || "",
        status: data.status || "ACTIVE",
      });
    } catch (error) {
      console.error("Error fetching merchant:", error);
      toast.error("Failed to load merchant details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchant();
  }, [id]); 

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.put(`/api/merchants/${id}`, formData);

      if (!response.ok) {
        throw new Error("Failed to update merchant");
      }

      toast.success("Merchant updated successfully");
      fetchMerchant();
    } catch (error) {
      console.error("Error updating merchant:", error);
      toast.error("Failed to update merchant");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this merchant?")) {
      return;
    }
    
    try {
      const response = await apiClient.delete(`/api/merchants/${id}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete merchant");
      }
      
      toast.success("Merchant deleted successfully");
      router.push("/admin/merchant");
    } catch (error) {
      console.error("Error deleting merchant:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message || "Failed to delete merchant"
          : "Failed to delete merchant"
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-950 min-h-screen text-slate-100 flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col">
        <DashboardSidebar />
        <div className="flex-1 p-10 flex items-center justify-center text-slate-400">
          Loading merchant details...
        </div>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="bg-slate-950 min-h-screen text-slate-100 flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col">
        <DashboardSidebar />
        <div className="flex-1 p-10 flex items-center justify-center text-slate-400">
          Merchant not found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col max-xl:h-fit max-xl:gap-y-4">
      <DashboardSidebar />
      <div className="w-full p-6 lg:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">Merchant Details</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/merchant"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all duration-200 text-sm border border-slate-700"
            >
              Back to Merchants
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-semibold rounded-xl transition-all duration-200 text-sm"
            >
              Delete Merchant
            </button>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 transition-all duration-200"
              >
                <option value="ACTIVE" className="bg-slate-900 text-slate-200">Active</option>
                <option value="INACTIVE" className="bg-slate-900 text-slate-200">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200 h-28"
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <button 
                type="submit"
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 text-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Merchant Products</h2>
          {merchant.products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">In Stock</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {merchant.products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-medium text-slate-200">{product.title}</td>
                      <td className="p-3 text-emerald-400 font-semibold">${product.price / 100}</td>
                      <td className="p-3 text-slate-300">{product.inStock}</td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="px-3 py-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg border border-cyan-500/20 transition-all"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No products for this merchant yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}