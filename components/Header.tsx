// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Header />
// Input parameters: no input parameters
// Output: Header component
// *********************

"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";

import CartElement from "./CartElement";
import NotificationBell from "./NotificationBell";
import HeartElement from "./HeartElement";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  // getting all wishlist items by user id
  const getWishlistByUserId = async (id: string) => {
    const response = await apiClient.get(`/api/wishlist/${id}`, {
      cache: "no-store",
    });
    const wishlist = await response.json();
    const productArray: {
      id: string;
      title: string;
      price: number;
      image: string;
      slug:string
      stockAvailabillity: number;
    }[] = [];

    return; // temporary disable wishlist fetching while the issue is being resolved
    
    wishlist.map((item: any) => productArray.push({id: item?.product?.id, title: item?.product?.title, price: item?.product?.price, image: item?.product?.mainImage, slug: item?.product?.slug, stockAvailabillity: item?.product?.inStock}));
    
    setWishlist(productArray);
  };

  // getting user by email so I can get his user id
  const getUserByEmail = async () => {
    if (session?.user?.email) {
      
      apiClient.get(`/api/users/email/${session?.user?.email}`, {
        cache: "no-store",
      })
        .then((response) => response.json())
        .then((data) => {
          getWishlistByUserId(data?.id);
        });
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email, wishlist.length]);

  return (
    <header className="bg-slate-950 sticky top-0 z-50 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
      <HeaderTop />
      {pathname.startsWith("/admin") === false && (
        <div className="py-4 bg-slate-950/90 flex items-center justify-between px-6 md:px-12 max-lg:flex-col max-lg:gap-y-5 max-lg:justify-center max-w-screen-2xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/logo v1 svg.svg"
              width={260}
              height={60}
              alt="singitronic logo"
              className="brightness-200 contrast-200 hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <div className="w-full lg:max-w-xl mx-4">
            <SearchInput />
          </div>
          <div className="flex gap-x-6 sm:gap-x-8 items-center">
            <NotificationBell />
            <HeartElement wishQuantity={wishQuantity} />
            <CartElement />
          </div>
        </div>
      )}
      {pathname.startsWith("/admin") === true && (
        <div className="flex justify-between py-4 bg-slate-950/90 items-center px-6 md:px-12 max-w-screen-2xl mx-auto border-b border-slate-800/60">
          <Link href="/">
            <Image
              src="/logo v1.png"
              width={140}
              height={40}
              alt="singitronic logo"
              className="w-48 h-auto brightness-200 contrast-200"
            />
          </Link>
          <div className="flex gap-x-6 items-center">
            <NotificationBell />
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="w-10 h-10 rounded-full ring-2 ring-cyan-500/40 hover:ring-cyan-400 transition-all overflow-hidden">
                <Image
                  src="/randomuser.jpg"
                  alt="random profile photo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[50] menu p-2 shadow-2xl bg-slate-900 border border-slate-800 rounded-xl w-52 text-slate-200 mt-2"
              >
                <li>
                  <Link href="/admin" className="hover:text-cyan-400 hover:bg-slate-800/60">Dashboard</Link>
                </li>
                <li>
                  <a className="hover:text-cyan-400 hover:bg-slate-800/60">Profile</a>
                </li>
                <li onClick={handleLogout}>
                  <a href="#" className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
