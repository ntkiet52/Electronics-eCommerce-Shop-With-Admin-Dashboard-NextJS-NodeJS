// *********************
// Role of the component: Product table component on admin dashboard page
// Name of the component: DashboardProductTable.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <DashboardProductTable />
// Input parameters: no input parameters
// Output: products table
// *********************

"use client";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    apiClient.get("/api/products?mode=admin", {cache: "no-store"})
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      });
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">All Products</h1>
        <Link href="/admin/products/new">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20">
            + Add New Product
          </button>
        </Link>
      </div>

      <div className="xl:ml-5 w-full max-xl:mt-5 overflow-auto h-[80vh] rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
            <tr className="border-b border-slate-800">
              <th className="py-4 px-4 text-left">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 accent-cyan-500" />
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock</th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={nanoid()} className="hover:bg-slate-800/40 transition-colors duration-150">
                  <td className="py-4 px-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 accent-cyan-500" />
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 ring-1 ring-slate-700">
                        <Image
                          width={48}
                          height={48}
                          src={product?.mainImage ? `/${product?.mainImage}` : "/product_placeholder.jpg"}
                          alt={sanitize(product?.title) || "Product image"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200 line-clamp-1">{sanitize(product?.title)}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{sanitize(product?.manufacturer)}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    {product?.inStock ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        In Stock
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Out of Stock
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-slate-200 font-semibold">${product?.price}</span>
                  </td>

                  <td className="py-4 px-4">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-200"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-16 text-center text-slate-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardProductTable;
