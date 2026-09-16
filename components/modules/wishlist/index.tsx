"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import WishItem from "@/components/WishItem";
import apiClient from "@/lib/api";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";

export const WishlistModule = () => {
  const { data: session } = useSession();
  const { wishlist, setWishlist } = useWishlistStore();

  const getWishlistByUserId = async (id: string) => {
    try {
      const response = await apiClient.get(`/api/wishlist/${id}`, {
        cache: "no-store",
      });
      const wishlistData = await response.json();

      const productArray: {
        id: string;
        title: string;
        price: number;
        image: string;
        slug: string;
        stockAvailabillity: number;
      }[] = [];

      if (Array.isArray(wishlistData)) {
        wishlistData.forEach((item: any) =>
          productArray.push({
            id: item?.product?.id,
            title: item?.product?.title,
            price: item?.product?.price,
            image: item?.product?.mainImage,
            slug: item?.product?.slug,
            stockAvailabillity: item?.product?.inStock,
          })
        );
      }

      setWishlist(productArray);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const getUserByEmail = async () => {
    if (session?.user?.email) {
      apiClient
        .get(`/api/users/email/${session?.user?.email}`, {
          cache: "no-store",
        })
        .then((response) => response.json())
        .then((data) => {
          if (data?.id) {
            getWishlistByUserId(data.id);
          }
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col">
      <SectionTitle title="Wishlist" path="Home | Wishlist" />
      <div className="flex-1 py-12 px-6 lg:px-12 max-w-screen-2xl mx-auto w-full">
        {!wishlist || wishlist.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 max-w-xl mx-auto shadow-xl backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-white mb-2">No items in your wishlist</h3>
            <p className="text-slate-400 text-sm">Browse products and click the heart icon to save your favorites!</p>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4 text-center w-16">Remove</th>
                    <th className="p-4 text-center">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {wishlist.map((item) => (
                    <WishItem
                      id={item?.id}
                      title={item?.title}
                      price={item?.price}
                      image={item?.image}
                      slug={item?.slug}
                      stockAvailabillity={item?.stockAvailabillity}
                      key={nanoid()}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
