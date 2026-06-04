import React, { useState } from "react";

export default function App() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-slate-100 font-sans">
      
      {/* Main Container Card */}
      <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 text-center transition-all duration-300 hover:border-indigo-500">
        
        {/* Simple Text Icon Mock */}
        <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-lg flex items-center justify-center mx-auto mb-4 font-bold text-xl border border-indigo-500/30">
          #
        </div>

        {/* Headings */}
        <h1 className="text-xl font-bold text-white tracking-tight">Tailwind Test</h1>
        <p className="text-xs text-slate-400 mt-1 mb-6">Asset Management System Base</p>

        {/* Live CSS Grid Check */}
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-6">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded text-white">
            Gradients: ON
          </div>
          <div className="p-2 bg-slate-700 border border-slate-600 rounded text-slate-300">
            Grid Layout: ON
          </div>
        </div>

        {/* Interactive Interactive Button */}
        <button
          onClick={() => setClickCount(clickCount + 1)}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-600/20 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          Clicks Checked: {clickCount}
        </button>

      </div>

      <span className="text-[10px] text-slate-600 mt-4 tracking-wider uppercase">
        Environment Diagnostic Terminal
      </span>
    </div>
  );
}