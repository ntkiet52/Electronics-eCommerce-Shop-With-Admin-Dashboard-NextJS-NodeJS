// *********************
// Role of the component: Classical hero component on home page
// Name of the component: Hero.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Hero />
// Input parameters: no input parameters
// Output: Classical hero component with two columns on desktop and one column on smaller devices
// *********************

import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden w-full bg-slate-950 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-16 md:py-24 border-b border-slate-800/60">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-items-center px-6 md:px-12 max-w-screen-2xl mx-auto min-h-[550px] gap-y-12 lg:gap-x-12 relative z-10">
        <div className="flex flex-col gap-y-6 lg:col-span-2 text-left items-start">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs md:text-sm font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Next-Gen Tech Collection 2026
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
            THE PRODUCT OF THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300">FUTURE</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl font-light">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor modi iure laudantium necessitatibus ab, voluptates vitae ullam. Officia ipsam iusto beatae nesciunt, consequatur deserunt minima maiores earum obcaecati. Optio, nam!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold px-10 py-4 rounded-xl text-base md:text-lg shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40 text-center"
            >
              BUY NOW
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 font-semibold px-10 py-4 rounded-xl text-base md:text-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-slate-500 text-center"
            >
              LEARN MORE
            </Link>
          </div>
        </div>

        <div className="relative group flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
          <Image
            src="/watch for banner.png"
            width={420}
            height={420}
            alt="smart watch"
            priority
            className="relative z-10 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[420px] md:h-[420px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
