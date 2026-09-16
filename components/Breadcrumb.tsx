// *********************
// Role of the component: Component that displays current page location in the application 
// Name of the component: Breadcrumb.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Breadcrumb />
// Input parameters: No input parameters
// Output: Page location in the application
// *********************

import Link from "next/link";
import React from "react";
import { FaHouse } from "react-icons/fa6";

const Breadcrumb = () => {
  return (
    <div className="text-sm font-medium text-slate-400 py-4 mb-2">
      <ul className="flex items-center gap-2 flex-wrap">
        <li>
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
            <FaHouse className="text-xs text-cyan-400" />
            Home
          </Link>
        </li>
        <li className="text-slate-600">/</li>
        <li>
          <Link href="/shop" className="hover:text-cyan-400 transition-colors">Shop</Link>
        </li>
        <li className="text-slate-600">/</li>
        <li className="text-slate-200 font-semibold">
          All Products
        </li>
      </ul>
    </div>
  );
};

export default Breadcrumb;
