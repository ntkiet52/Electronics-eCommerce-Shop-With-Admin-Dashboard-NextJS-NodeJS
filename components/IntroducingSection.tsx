// *********************
// Role of the component: IntroducingSection with the text "Introducing Singitronic"
// Name of the component: IntroducingSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <IntroducingSection />
// Input parameters: no input parameters
// Output: Section with the text "Introducing Singitronic" and button
// *********************

import Link from "next/link";
import React from "react";

const IntroducingSection = () => {
  return (
    <div className="relative py-20 bg-slate-900 overflow-hidden border-b border-slate-800">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-cyan-500/15 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col gap-y-6 items-center">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-4 py-1.5 rounded-full border border-cyan-500/30">
          Premium Tech Destination
        </span>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase">
          INTRODUCING <span className="text-slate-100">SINGI</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">TRONIC</span>
        </h2>

        <div className="space-y-2 max-w-2xl">
          <p className="text-slate-300 text-lg md:text-xl font-medium">
            Buy the latest electronics.
          </p>
          <p className="text-slate-400 text-base md:text-lg font-light">
            The best electronics for tech lovers.
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold px-10 py-3.5 rounded-xl text-lg shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 mt-2"
        >
          SHOP NOW
        </Link>
      </div>
    </div>
  );
};

export default IntroducingSection;
