// *********************
// Role of the component: Pagination for navigating the shop page
// Name of the component: Pagination.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Pagination />
// Input parameters: no input parameters
// Output: Component with the current page and buttons for incrementing and decrementing page
// *********************

"use client";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import React from "react";

const Pagination = () => {
  // getting from Zustand store current page and methods for incrementing and decrementing current page
  const { page, incrementPage, decrementPage } = usePaginationStore();
  return (
    <div className="flex justify-center items-center gap-2 py-16">
      <button
        className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-200 font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={() => decrementPage()}
        disabled={page <= 1}
      >
        «
      </button>
      <div className="flex items-center gap-1">
        <span className="px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold text-sm min-w-[90px] text-center">
          Page {page}
        </span>
      </div>
      <button
        className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-200 font-bold text-lg"
        onClick={() => incrementPage()}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
