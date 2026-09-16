// *********************
// Role of the component: Search input element located in the header but it can be used anywhere in your application
// Name of the component: SearchInput.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SearchInput />
// Input parameters: no input parameters
// Output: form with search input and button
// *********************

"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { sanitize } from "@/lib/sanitize";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();

  // function for modifying URL for searching products
  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Sanitize the search input before using it in URL
    const sanitizedSearch = sanitize(searchInput);
    router.push(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
    setSearchInput("");
  };

  return (
    <form className="flex w-full justify-center group" onSubmit={searchProducts}>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search next-gen electronics, phones, laptops..."
        className="w-full bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 px-4 py-2.5 rounded-l-xl outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all duration-200"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold px-6 py-2.5 rounded-r-xl text-sm transition-all duration-200 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 shrink-0"
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;
