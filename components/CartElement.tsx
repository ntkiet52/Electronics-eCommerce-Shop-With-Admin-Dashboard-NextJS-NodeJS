// *********************
// Role of the component: Cart icon and quantity that will be located in the header
// Name of the component: CartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CartElement />
// Input parameters: no input parameters
// Output: Cart icon and quantity
// *********************

"use client";
import Link from 'next/link'
import React from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import { useProductStore } from "@/app/_zustand/store";

const CartElement = () => {
    const { allQuantity } = useProductStore();
  return (
    <div className="relative group">
      <Link href="/cart" className="flex items-center justify-center p-2 rounded-xl text-slate-200 hover:text-cyan-400 hover:bg-slate-800/60 transition-all duration-200">
        <FaCartShopping className="text-xl" />
        <span className="w-5 h-5 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-xs font-bold rounded-full flex justify-center items-center absolute -top-1.5 -right-1.5 shadow-[0_0_10px_rgba(6,182,212,0.6)]">
          {allQuantity}
        </span>
      </Link>
    </div>
  );
}

export default CartElement