export const dynamic = "force-dynamic";

import { ProductItem, SectionTitle } from "@/components";
import apiClient from "@/lib/api";
import React from "react";
import { sanitize } from "@/lib/sanitize";

interface Props {
  searchParams: { search: string };
}

// sending api request for search results for a given search text
const SearchPage = async ({ searchParams }: Props) => {
  const sp = await searchParams;
  let products = [];

  try {
    const data = await apiClient.get(
      `/api/search?query=${sp?.search || ""}`
    );

    if (!data.ok) {
      console.error('Failed to fetch search results:', data.statusText);
      products = [];
    } else {
      const result = await data.json();
      products = Array.isArray(result) ? result : [];
    }
  } catch (error) {
    console.error('Error fetching search results:', error);
    products = [];
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-16">
      <SectionTitle title="Search Results" path="Home | Search" />
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        {sp?.search && (
          <h3 className="text-2xl sm:text-3xl font-bold text-center py-8 text-slate-200">
            Showing results for <span className="text-cyan-400 font-extrabold">"{sanitize(sp?.search)}"</span>
          </h3>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductItem key={product.id} product={product} color="white" />
            ))
          ) : (
            <div className="col-span-full py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-300">
                No products found matching your search query
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try checking for spelling errors, using more generic search terms, or browsing categories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

/*

*/
