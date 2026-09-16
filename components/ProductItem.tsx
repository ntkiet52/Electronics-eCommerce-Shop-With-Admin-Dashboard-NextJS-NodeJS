// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Product item component that contains product image, title, link to the single product page, price, button...
// *********************

import Image from "next/image";
import React from "react";
import Link from "next/link";

import { sanitize } from "@/lib/sanitize";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  const isWhite = color === "white";

  return (
    <div
      className={`group flex flex-col justify-between w-full h-full rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 ${
        isWhite
          ? "bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] text-white"
          : "bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xl text-slate-900"
      }`}
    >
      <Link
        href={`/product/${product.slug}`}
        className="block relative w-full h-[240px] overflow-hidden rounded-xl bg-slate-800/40 flex items-center justify-center p-4"
      >
        <Image
          src={
            product.mainImage
              ? `/${product.mainImage}`
              : "/product_placeholder.jpg"
          }
          width={300}
          height={300}
          className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          alt={sanitize(product?.title) || "Product image"}
        />
      </Link>

      <div className="flex flex-col gap-y-2 mt-4 flex-grow">
        <Link
          href={`/product/${product.slug}`}
          className={`font-bold text-base md:text-lg line-clamp-2 transition-colors duration-200 ${
            isWhite
              ? "text-slate-100 group-hover:text-cyan-300"
              : "text-slate-800 group-hover:text-blue-600"
          }`}
        >
          {sanitize(product.title)}
        </Link>
        <div className="flex items-center justify-between mt-auto pt-2">
          <p
            className={`text-xl font-black ${
              isWhite ? "text-cyan-400" : "text-blue-600"
            }`}
          >
            ${product.price}
          </p>
          {product.inStock !== undefined && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                product.inStock > 0
                  ? isWhite
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-emerald-100 text-emerald-700"
                  : isWhite
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {product.inStock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          )}
        </div>
      </div>

      <Link
        href={`/product/${product?.slug}`}
        className={`mt-4 w-full flex justify-center items-center py-2.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
          isWhite
            ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md shadow-blue-600/20 hover:shadow-cyan-500/30"
            : "bg-slate-900 hover:bg-blue-600 text-white shadow-md hover:shadow-blue-500/25"
        }`}
      >
        <p>View product</p>
      </Link>
    </div>
  );
};

export default ProductItem;
