"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { sanitize } from "@/lib/sanitize";

interface WishItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
}

const WishItem = ({
  id,
  title,
  price,
  image,
  slug,
  stockAvailabillity,
}: WishItemProps) => {
  const { removeFromWishlist } = useWishlistStore();

  return (
    <tr className="border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors">
      <td className="p-4 text-center">
        <button
          onClick={() => removeFromWishlist(id)}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          title="Remove item"
        >
          <FaTrash className="text-sm" />
        </button>
      </td>
      <td className="p-4">
        <div className="flex justify-center">
          <Link
            href={`/product/${slug || "#"}`}
            className="w-16 h-16 bg-slate-800/60 rounded-xl p-2 flex items-center justify-center border border-slate-700 hover:border-cyan-400 transition-colors"
          >
            <Image
              src={image ? `/${image}` : "/product_placeholder.jpg"}
              width={64}
              height={64}
              alt={sanitize(title) || "Product image"}
              className="max-h-full w-auto object-contain"
            />
          </Link>
        </div>
      </td>
      <td className="p-4 font-semibold text-slate-100">
        <Link
          href={`/product/${slug || "#"}`}
          className="hover:text-cyan-400 transition-colors"
        >
          {sanitize(title)}
        </Link>
      </td>
      <td className="p-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            stockAvailabillity > 0
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          {stockAvailabillity > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </td>
      <td className="p-4 font-bold text-cyan-400 text-lg">
        ${price}
      </td>
    </tr>
  );
};

export default WishItem;
