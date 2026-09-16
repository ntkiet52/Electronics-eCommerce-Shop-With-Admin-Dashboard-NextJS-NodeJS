// *********************
// Role of the component: Incentives on home page like Free Shipping, 24/7 Customer Support, Fast Shopping Cart...
// Name of the component: Incentives.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Incentives />
// Input parameters: no input parameters
// Output: Incentives section
// *********************

import { incentives } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

const Incentives = () => {
  return (
    <div className="bg-slate-950 border-b border-slate-800/80 py-16">
      <h2 className="text-3xl sm:text-4xl font-black text-center text-white uppercase tracking-tight mb-12">
        WHY CHOOSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">SINGITRONIC</span>
      </h2>
      <div className="mx-auto max-w-screen-2xl px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {incentives.map((incentive) => (
            <div
              key={incentive.name}
              className="group flex flex-col items-center text-center p-8 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-3xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(6,182,212,0.15)]"
            >
              <div className="p-4 rounded-2xl bg-slate-800/80 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-300 mb-4 border border-slate-700/60">
                <Image
                  width={56}
                  height={56}
                  className="w-12 h-12 object-contain brightness-200 contrast-200"
                  src={incentive.imageSrc}
                  alt={incentive.name}
                />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {incentive.name}
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed font-light">
                {incentive.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Incentives