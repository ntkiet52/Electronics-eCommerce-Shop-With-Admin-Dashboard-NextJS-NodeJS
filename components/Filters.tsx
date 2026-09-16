// *********************
// Role of the component: Filters on shop page
// Name of the component: Filters.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Filters />
// Input parameters: no input parameters
// Output: stock, rating and price filter
// *********************

"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";

interface InputCategory {
  inStock: { text: string, isChecked: boolean },
  outOfStock: { text: string, isChecked: boolean },
  priceFilter: { text: string, value: number },
  ratingFilter: { text: string, value: number },
}

const Filters = () => {
  const pathname = usePathname();
  const { replace } = useRouter();

  // getting current page number from Zustand store
  const { page } = usePaginationStore();

  const [inputCategory, setInputCategory] = useState<InputCategory>({
    inStock: { text: "instock", isChecked: true },
    outOfStock: { text: "outofstock", isChecked: true },
    priceFilter: { text: "price", value: 3000 },
    ratingFilter: { text: "rating", value: 0 },
  });
  const { sortBy } = useSortStore();

  useEffect(() => {
    const params = new URLSearchParams();
    // setting URL params and after that putting them all in URL
    params.set("outOfStock", inputCategory.outOfStock.isChecked.toString());
    params.set("inStock", inputCategory.inStock.isChecked.toString());
    params.set("rating", inputCategory.ratingFilter.value.toString());
    params.set("price", inputCategory.priceFilter.value.toString());
    params.set("sort", sortBy);
    params.set("page", page.toString());
    replace(`${pathname}?${params}`);
  }, [inputCategory, sortBy, page]);

  return (
    <div className="space-y-6 text-slate-200">
      <h3 className="text-xl font-bold uppercase tracking-wider text-white pb-3 border-b border-slate-800">
        Filter Products
      </h3>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Availability</h4>
        <div className="space-y-2">
          <label className="cursor-pointer flex items-center gap-3 group">
            <input
              type="checkbox"
              checked={inputCategory.inStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  inStock: {
                    text: "instock",
                    isChecked: !inputCategory.inStock.isChecked,
                  },
                })
              }
              className="checkbox checkbox-primary rounded-lg border-slate-700 bg-slate-800"
            />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">In stock</span>
          </label>

          <label className="cursor-pointer flex items-center gap-3 group">
            <input
              type="checkbox"
              checked={inputCategory.outOfStock.isChecked}
              onChange={() =>
                setInputCategory({
                  ...inputCategory,
                  outOfStock: {
                    text: "outofstock",
                    isChecked: !inputCategory.outOfStock.isChecked,
                  },
                })
              }
              className="checkbox checkbox-primary rounded-lg border-slate-700 bg-slate-800"
            />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Out of stock
            </span>
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Price Limit</h4>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={3000}
            step={10}
            value={inputCategory.priceFilter.value}
            className="range range-accent accent-cyan-400 h-2 bg-slate-800 rounded-lg"
            onChange={(e) =>
              setInputCategory({
                ...inputCategory,
                priceFilter: {
                  text: "price",
                  value: Number(e.target.value),
                },
              })
            }
          />
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>$0</span>
            <span className="font-bold text-cyan-400">${inputCategory.priceFilter.value}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Minimum Rating</h4>
        <input
          type="range"
          min={0}
          max="5"
          value={inputCategory.ratingFilter.value}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              ratingFilter: { text: "rating", value: Number(e.target.value) },
            })
          }
          className="range range-info h-2 bg-slate-800 rounded-lg"
          step="1"
        />
        <div className="w-full flex justify-between text-xs text-slate-400 px-1 font-medium">
          <span>0★</span>
          <span>1★</span>
          <span>2★</span>
          <span>3★</span>
          <span>4★</span>
          <span>5★</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
