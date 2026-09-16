"use client";
import { CustomButton, SectionTitle } from "@/components";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    // chechking if user has already registered redirect to home page
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[2].value;
    const password = e.target[3].value;
    const confirmPassword = e.target[4].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be 8 characters long");
      toast.error("Password must be 8 characters long");
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords are not equal");
      toast.error("Passwords are not equal");
      return;
    }

    try {
      // sending API request for registering user
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        toast.success("Registration successful");
        router.push("/login");
      } else {
        // Handle different types of errors
        if (data.details && Array.isArray(data.details)) {
          // Validation errors
          const errorMessage = data.details.map((err: any) => err.message).join(", ");
          setError(errorMessage);
          toast.error(errorMessage);
        } else if (data.error) {
          // General errors
          setError(data.error);
          toast.error(data.error);
        } else {
          setError("Registration failed");
          toast.error("Registration failed");
        }
      }
    } catch (error) {
      toast.error("Error, try again");
      setError("Error, try again");
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium tracking-wide">Loading your session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <SectionTitle title="Register" path="Home | Register" />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-5xl rounded-3xl bg-slate-900/80 border border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
          
          {/* Left Hero / Brand Section */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-r border-slate-800/80 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-8">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Join Singitronic
              </div>

              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Tech Account</span>
              </h2>

              <p className="mt-4 text-slate-300 text-sm leading-relaxed font-light">
                Unlock member-only discounts, save your wishlists, receive instant order notifications, and checkout faster.
              </p>
            </div>

            <div className="space-y-4 my-8">
              <div className="flex items-center gap-3 text-slate-300 text-xs font-medium bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Free Membership & Instant Access</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300 text-xs font-medium bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span>256-Bit SSL Encrypted Account Protection</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Singitronic Inc. All rights reserved.
            </div>
          </div>

          {/* Right Form Section */}
          <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-slate-900/60">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Sign up for an account
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-4"
                >
                  Sign in instead
                </Link>
              </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Input 0: Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    First Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="John"
                    className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                  />
                </div>

                {/* Input 1: Lastname */}
                <div>
                  <label
                    htmlFor="lastname"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    placeholder="Doe"
                    className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                  />
                </div>

                {/* Input 2: Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                  />
                </div>

                {/* Input 3: Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Min. 8 characters"
                    className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                  />
                </div>

                {/* Input 4: Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmpassword"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmpassword"
                    name="confirmpassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Re-enter password"
                    className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                  />
                </div>

                {/* Input 5: Checkbox */}
                <div className="pt-1">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      required
                      className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2.5 block text-xs text-slate-300 font-medium cursor-pointer"
                    >
                      I accept the terms and privacy policy
                    </label>
                  </div>
                </div>

                {/* Input 6: Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>
              </form>

              {/* Error Alert Box */}
              {error && (
                <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
