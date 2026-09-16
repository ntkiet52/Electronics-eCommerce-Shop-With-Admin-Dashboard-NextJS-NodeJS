export const dynamic = "force-dynamic";

import {
  StockAvailabillity,
  UrgencyText,

  ProductTabs,
  SingleProductDynamicFields,
  
} from "@/components";
import apiClient from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquarePinterest } from "react-icons/fa6";
import { sanitize } from "@/lib/sanitize";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{  productSlug: string, id: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;
  // sending API request for a single product with a given product slug
  const data = await apiClient.get(
    `/api/slugs/${paramsAwaited?.productSlug}`
  );
  const product = await data.json();

  // sending API request for more than 1 product image if it exists
  const imagesData = await apiClient.get(
    `/api/images/${paramsAwaited?.id}`
  );
  const images = await imagesData.json();

  if (!product || product.error) {
    notFound();
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-8">
          {/* Left Column: Product Image Gallery */}
          <div className="flex flex-col items-center bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
            <div className="relative w-full max-w-md h-[400px] flex items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none" />
              <Image
                src={product?.mainImage ? `/${product?.mainImage}` : "/product_placeholder.jpg"}
                width={450}
                height={450}
                alt={sanitize(product?.title) || "main image"}
                className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105 relative z-10"
              />
            </div>
            {images && images.length > 0 && (
              <div className="flex justify-center gap-3 mt-6 flex-wrap">
                {images.map((imageItem: ImageItem, key: number) => (
                  <div key={imageItem.imageID + key} className="p-2 bg-slate-950/80 border border-slate-800 rounded-xl hover:border-cyan-400 transition-colors cursor-pointer">
                    <Image
                      src={`/${imageItem.image}`}
                      width={80}
                      height={80}
                      alt="product view"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-col gap-y-6 text-slate-200 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-xl">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {sanitize(product?.title)}
            </h1>

            <div className="flex items-center gap-4">
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                ${product?.price}
              </p>
              <StockAvailabillity stock={94} inStock={product?.inStock} />
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <SingleProductDynamicFields product={product} />
            </div>

            <div className="flex flex-col gap-y-4 pt-6 border-t border-slate-800/80 text-sm">
              <p className="text-slate-400 font-medium">
                SKU: <span className="ml-1 text-slate-200 font-mono">ABCCD-18</span>
              </p>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium">Share:</span>
                <div className="flex items-center gap-x-3 text-xl text-slate-400">
                  <FaSquareFacebook className="hover:text-cyan-400 transition-colors cursor-pointer" />
                  <FaSquareXTwitter className="hover:text-cyan-400 transition-colors cursor-pointer" />
                  <FaSquarePinterest className="hover:text-cyan-400 transition-colors cursor-pointer" />
                </div>
              </div>

              <div className="flex gap-x-3 items-center pt-2">
                <Image
                  src="/visa.svg"
                  width={50}
                  height={50}
                  alt="visa icon"
                  className="w-auto h-7 brightness-200 contrast-200"
                />
                <Image
                  src="/mastercard.svg"
                  width={50}
                  height={50}
                  alt="mastercard icon"
                  className="w-auto h-7 brightness-200 contrast-200"
                />
                <Image
                  src="/ae.svg"
                  width={50}
                  height={50}
                  alt="american express icon"
                  className="w-auto h-7 brightness-200 contrast-200"
                />
                <Image
                  src="/paypal.svg"
                  width={50}
                  height={50}
                  alt="paypal icon"
                  className="w-auto h-7 brightness-200 contrast-200"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="py-12">
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
