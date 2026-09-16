// *********************
// Role of the component: Single product tabs on the single product page containing product description, main product info and reviews
// Name of the component: ProductTabs.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductTabs product={product} />
// Input parameters: { product: Product }
// Output: Single product tabs containing product description, main product info and reviews
// *********************

"use client";

import React, { useState } from "react";
import RatingPercentElement from "./RatingPercentElement";
import SingleReview from "./SingleReview";
import { formatCategoryName } from "@/utils/categoryFormating";
import { sanitize, sanitizeHtml } from "@/lib/sanitize";

const ProductTabs = ({ product }: { product: Product }) => {
  const [currentProductTab, setCurrentProductTab] = useState<number>(0);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 text-slate-200 backdrop-blur-xl shadow-xl">
      <div className="flex border-b border-slate-800 gap-6 pb-4">
        <button
          className={`text-lg font-bold pb-2 transition-all border-b-2 cursor-pointer ${
            currentProductTab === 0
              ? "text-cyan-400 border-cyan-400"
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
          onClick={() => setCurrentProductTab(0)}
        >
          Description
        </button>
        <button
          className={`text-lg font-bold pb-2 transition-all border-b-2 cursor-pointer ${
            currentProductTab === 1
              ? "text-cyan-400 border-cyan-400"
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
          onClick={() => setCurrentProductTab(1)}
        >
          Additional Info
        </button>
      </div>

      <div className="pt-6">
        {currentProductTab === 0 && (
          <div 
            className="text-slate-300 text-base leading-relaxed prose prose-invert max-w-none font-light"
            dangerouslySetInnerHTML={{ 
              __html: sanitizeHtml(product?.description) 
            }}
          />
        )}

        {currentProductTab === 1 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 border-collapse">
              <tbody>
                <tr className="border-b border-slate-800/80">
                  <th className="py-3 px-4 font-semibold text-cyan-400 w-1/3">Manufacturer</th>
                  <td className="py-3 px-4">{sanitize(product?.manufacturer)}</td>
                </tr>
                <tr className="border-b border-slate-800/80">
                  <th className="py-3 px-4 font-semibold text-cyan-400">Category</th>
                  <td className="py-3 px-4">
                    {product?.category?.name
                      ? sanitize(formatCategoryName(product?.category?.name))
                      : "No category"}
                  </td>
                </tr>
                <tr>
                  <th className="py-3 px-4 font-semibold text-cyan-400">Available Colors</th>
                  <td className="py-3 px-4">Silver, Space Gray, Deep Cyan, Obsidian</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
