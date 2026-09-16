// *********************
// Role of the component: Section title that can be used on any page
// Name of the component: SectionTitle.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SectionTitle />
// Input parameters: {title: string; path: string}
// Output: div containing h1 for page title and p for page location path 
// *********************

import React from 'react'

const SectionTitle = ({title, path} : {title: string; path: string}) => {
  return (
    <div className="relative overflow-hidden py-14 px-6 border-b border-slate-800/80 bg-slate-950 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 mb-6 text-center">
        {/* Subtle ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300 tracking-tight uppercase mb-3 relative z-10">
          { title }
        </h1>
        <p className="text-sm sm:text-base font-medium text-cyan-400/90 tracking-widest uppercase relative z-10">
          { path }
        </p>
    </div>
  )
}

export default SectionTitle