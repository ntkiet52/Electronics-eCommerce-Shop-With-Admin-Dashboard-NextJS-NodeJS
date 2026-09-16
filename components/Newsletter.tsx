// *********************
// Role of the component: Signup to the newsletter component by leaving email adress
// Name of the component: Newsletter.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Newsletter />
// Input parameters: no input parameters
// Output: Section with the email input and some text
// *********************

import React from 'react'

const Newsletter = () => {
  return (
    <div className="bg-slate-900/60 border-t border-b border-slate-800/80 py-16 lg:py-20 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="mx-auto max-w-screen-2xl px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-7 space-y-2 text-center lg:text-left">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Want exclusive tech deals & updates?
          </h2>
          <p className="text-slate-400 text-base md:text-lg font-light">
            Subscribe to the Singitronic newsletter for instant promo codes and product drops.
          </p>
        </div>
        
        <form className="w-full lg:col-span-5" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="flex-auto rounded-xl bg-slate-950/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all"
              placeholder="Enter your email address"
            />
            <button
              type="submit"
              className="flex-none rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold px-6 py-3 text-sm tracking-wider uppercase shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-400 text-center lg:text-left">
            We care about your privacy. Read our{' '}
            <a href="#" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors underline">
              privacy policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}

export default Newsletter