export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  Breadcrumb,
  Filters,
  Pagination,
  Products,
  SortBy,
} from "@/components";
import React from "react";
import { sanitize } from "@/lib/sanitize";

// improve readabillity of category text, for example category text "smart-watches" will be "smart watches"
const improveCategoryText = (text: string): string => {
  if (text.indexOf("-") !== -1) {
    let textArray = text.split("-");

    return textArray.join(" ");
  } else {
    return text;
  }
};

const ShopPage = async ({ params, searchParams }: { params: Promise<{ slug?: string[] }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  // Await both params and searchParams
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <Breadcrumb />
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-8 mt-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl h-fit shadow-xl">
            <Filters />
          </div>
          <div>
            <div className="flex justify-between items-center max-lg:flex-col max-lg:gap-y-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 mb-6 backdrop-blur-md">
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {awaitedParams?.slug && awaitedParams?.slug[0]?.length > 0
                  ? sanitize(improveCategoryText(awaitedParams?.slug[0]))
                  : "All products"}
              </h2>

              <SortBy />
            </div>
            <Products params={awaitedParams} searchParams={awaitedSearchParams} />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
