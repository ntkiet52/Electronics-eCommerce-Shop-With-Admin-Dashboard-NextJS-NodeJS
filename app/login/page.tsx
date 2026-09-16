"use client";
import { CustomButton, SectionTitle } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    // Check if session expired
    const expired = searchParams.get('expired');
    if (expired === 'true') {
      setError("Your session has expired. Please log in again.");
      toast.error("Your session has expired. Please log in again.");
    }
    
    // if user has already logged in redirect to home page
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router, searchParams]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmailAddressFormat(email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      toast.error("Password is invalid");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      toast.error("Invalid email or password");
      if (res?.url) router.replace("/");
    } else {
      setError("");
      toast.success("Successful login");
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
      <SectionTitle title="Login" path="Home | Login" />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-5xl rounded-3xl bg-slate-900/80 border border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
          
          {/* Left Hero / Brand Section */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-r border-slate-800/80 relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-8">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Singitronic Auth
              </div>

              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Welcome back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Singitronic</span>
              </h2>

              <p className="mt-4 text-slate-300 text-sm leading-relaxed font-light">
                Sign in to access your personal dashboard, track live orders, manage wishlists, and unlock exclusive member tech deals.
              </p>
            </div>

            <div className="space-y-4 my-8">
              <div className="flex items-center gap-3 text-slate-300 text-xs font-medium bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span>Encrypted 256-bit Secure Authentication</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300 text-xs font-medium bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>Fast & Seamless Next-Gen Checkout</span>
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
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Or{" "}
                <Link
                  href="/register"
                  className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-4"
                >
                  create a new account
                </Link>
              </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* 1st Input: Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="name@example.com"
                      className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 sm:text-sm transition-all duration-200"
                    />
                  </div>
                </div>

                {/* 2nd Input: Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 sm:text-sm transition-all duration-200"
                    />
                  </div>
                </div>

                {/* 3rd Input: Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-900 cursor-pointer"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2.5 block text-xs text-slate-300 font-medium cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-xs">
                    <a
                      href="#"
                      className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                {/* 4th Action: Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </form>

              {/* Error Message Box */}
              {error && (
                <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* OAuth Providers */}
              <div className="mt-8">
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wider">
                    <span className="bg-slate-900 px-4 text-slate-400 font-semibold">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 px-4 py-3 text-slate-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    onClick={() => {
                      signIn("google");
                    }}
                  >
                    <FcGoogle className="text-xl" />
                    <span className="text-xs font-bold tracking-wide">
                      Google
                    </span>
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 px-4 py-3 text-slate-200 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    onClick={() => {
                      signIn("github");
                    }}
                  >
                    <svg
                      className="h-5 w-5 fill-current text-white"
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs font-bold tracking-wide">
                      GitHub
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium tracking-wide">Loading login page...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;

