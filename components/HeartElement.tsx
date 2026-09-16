// *********************
// Role of the component: Wishlist icon with quantity located in the header
// Name of the component: HeartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <HeartElement />
// Input parameters: no input parameters
// Output: wishlist icon with quantity
// *********************

"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import Link from "next/link";
import React from "react";
import { FaHeart } from "react-icons/fa6";

const HeartElement = ({wishQuantity}: {wishQuantity: number}) => {
  return (
    <div className="relative group">
      <Link href="/wishlist" className="flex items-center justify-center p-2 rounded-xl text-slate-200 hover:text-rose-400 hover:bg-slate-800/60 transition-all duration-200">
        <FaHeart className="text-xl" />
        <span className="w-5 h-5 font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full flex justify-center items-center absolute -top-1.5 -right-1.5 shadow-[0_0_10px_rgba(244,63,94,0.6)]">
          {wishQuantity}
        </span>
      </Link>
    </div>
  );
};

export default HeartElement;
