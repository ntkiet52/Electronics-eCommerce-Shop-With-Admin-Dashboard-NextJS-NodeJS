// *********************
// Role of the component: Topbar of the header
// Name of the component: HeaderTop.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <HeaderTop />
// Input parameters: no input parameters
// Output: topbar with phone, email and login and register links
// *********************

"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { FaHeadphones } from "react-icons/fa6";
import { FaRegEnvelope } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";

const HeaderTop = () => {
  const { data: session }: any = useSession();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  }
  return (
    <div className="h-10 text-slate-300 bg-slate-950 border-b border-slate-800/80 max-lg:px-5 max-lg:h-16 max-[573px]:px-0">
      <div className="flex justify-between h-full max-lg:flex-col max-lg:justify-center max-lg:items-center max-w-screen-2xl mx-auto px-12 max-[573px]:px-0">
        <ul className="flex items-center h-full gap-x-6 text-xs md:text-sm max-[370px]:text-xs max-[370px]:gap-x-2">
          <li className="flex items-center gap-x-2 font-medium hover:text-cyan-400 transition-colors">
            <FaHeadphones className="text-cyan-400" />
            <span>0898693571</span>
          </li>
          <li className="flex items-center gap-x-2 font-medium hover:text-cyan-400 transition-colors">
            <FaRegEnvelope className="text-cyan-400 text-lg" />
            <span>thanhkiet@email.com</span>
          </li>
        </ul>
        <ul className="flex items-center gap-x-6 h-full text-xs md:text-sm max-[370px]:text-xs max-[370px]:gap-x-2 font-medium">
          {!session ? (
            <>
              <li className="flex items-center">
                <Link href="/login" className="flex items-center gap-x-2 hover:text-cyan-400 transition-colors">
                  <FaRegUser className="text-cyan-400" />
                  <span>Login</span>
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/register" className="flex items-center gap-x-2 hover:text-cyan-400 transition-colors">
                  <FaRegUser className="text-cyan-400" />
                  <span>Register</span>
                </Link>
              </li>
            </>
          ) : (<>
            <span className="ml-10 text-xs md:text-sm text-cyan-300 font-semibold">{session.user?.email}</span>
            {session.user?.role === "admin" && (
              <li className="flex items-center">
                <Link
                  href="/admin"
                  className="flex items-center gap-x-1.5 px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  <FaLocationDot className="text-cyan-400 text-xs" />
                  <span>Admin Dashboard</span>
                </Link>
              </li>
            )}
            <li className="flex items-center">
              <button onClick={() => handleLogout()} className="flex items-center gap-x-2 hover:text-rose-400 transition-colors">
                <FaRegUser className="text-slate-400" />
                <span>Log out</span>
              </button>
            </li>
          </>)}
        </ul>
      </div>
    </div>
  );
};

export default HeaderTop;
