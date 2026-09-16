"use client";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";

interface Merchant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  status: string;
  products: any[];
}

export default function MerchantPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/merchants");
      if (!response.ok) {
        throw new Error("Failed to fetch merchants");
      }
      const data = await response.json();
      setMerchants(data);
    } catch (error) {
      console.error("Error fetching merchants:", error);
      toast.error("Failed to load merchants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col max-xl:h-fit max-xl:gap-y-4">
      <DashboardSidebar />
      <div className="w-full p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">Merchants</h1>
          <Link
            href="/admin/merchant/new"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-cyan-500/20"
          >
            Add Merchant
          </Link>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading merchants...</div>
          ) : merchants.length > 0 ? (
            <div className="overflow-x-auto max-h-[75vh]">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs font-semibold text-slate-400 uppercase tracking-wider sticky top-0 backdrop-blur-md border-b border-slate-800">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Products</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {merchants.map((merchant) => (
                    <tr key={merchant.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-medium text-slate-200">{merchant.name}</td>
                      <td className="p-4 text-slate-400">{merchant.email || "N/A"}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            merchant.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {merchant.status}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-300">{merchant.products.length}</td>
                      <td className="p-4 text-right space-x-2">
                        <Link
                          href={`/admin/merchant/${merchant.id}`}
                          className="px-3 py-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg border border-cyan-500/20 transition-all"
                        >
                          View / Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">No merchants found</div>
          )}
        </div>
      </div>
    </div>
  );
}