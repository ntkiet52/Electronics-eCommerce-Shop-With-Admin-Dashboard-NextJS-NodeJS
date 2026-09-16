// *********************
// Role of the component: Simple H2 heading component
// Name of the component: Heading.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Heading title={title} />
// Input parameters: { title: string }
// Output: h2 heading title with some styles 
// *********************

import React from 'react'

const Heading = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center my-6">
      <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-4 py-1.5 rounded-full border border-cyan-500/30 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
        Featured Collections
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300 tracking-tight uppercase">
        {title}
      </h2>
      <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-4 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
    </div>
  )
}

export default Heading