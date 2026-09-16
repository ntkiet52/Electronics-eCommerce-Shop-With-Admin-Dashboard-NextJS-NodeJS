// *********************
// Role of the component: Category wrapper that will contain title and category items
// Name of the component: CategoryMenu.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryMenu />
// Input parameters: no input parameters
// Output: section title and category items
// *********************

import React from "react";
import CategoryItem from "./CategoryItem";
import Image from "next/image";
import { categoryMenuList } from "@/lib/utils";
import Heading from "./Heading";

const CategoryMenu = () => {
  return (
    <div className="py-16 bg-slate-950 border-b border-slate-800/60 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-indigo-600/10 blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
        <Heading title="BROWSE CATEGORIES" />
        <div className="py-8 gap-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categoryMenuList.map((item) => (
            <CategoryItem title={item.title} key={item.id} href={item.href}>
              <Image src={item.src} width={48} height={48} alt={item.title} className="w-12 h-12 object-contain" />
            </CategoryItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;
