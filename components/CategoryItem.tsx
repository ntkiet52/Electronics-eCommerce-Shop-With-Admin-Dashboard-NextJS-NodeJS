// *********************
// Role of the component: Category Item that will display category icon, category name and link to the category
// Name of the component: CategoryItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryItem title={title} href={href} ><Image /></CategoryItem>
// Input parameters: CategoryItemProps interface
// Output: Category icon, category name and link to the category
// *********************

import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const CategoryItem = ({ title, children, href }: CategoryItemProps) => {
  return (
    <Link href={href} className="group block h-full">
      <div className="flex flex-col items-center justify-center gap-y-3 bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/60 hover:border-cyan-500/50 rounded-2xl py-6 px-4 text-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(6,182,212,0.15)] backdrop-blur-sm h-full">
        <div className="p-3 rounded-xl bg-slate-700/40 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-300">
          {children}
        </div>

        <h3 className="font-bold text-base md:text-lg text-slate-200 group-hover:text-cyan-300 transition-colors duration-300 text-center">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryItem;
