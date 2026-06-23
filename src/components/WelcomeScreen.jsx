import React from 'react';
import { Camera } from 'lucide-react';

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass rounded-3xl p-8 md:p-10 shadow-2xl relative border border-white/5 flex flex-col items-center">
        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          MINIPHOTOBOX CIPA ❤️
        </h1>
        
        <p className="text-sm font-light tracking-[0.2em] text-gray-400 mb-8 uppercase">
          Selamat Datang
        </p>

        {/* Action Button */}
        <button
          onClick={onStart}
          className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-[#E6DFD3] text-[#121212] font-semibold rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-white/5 active:scale-98 overflow-hidden"
        >
          <Camera className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
          <span className="tracking-wide">Start Session / Mulai</span>
        </button>

        {/* Footer info */}
        <div className="mt-8 text-[10px] text-gray-500 font-light tracking-wide">
          Designed for both desktop & mobile · Safe & private
        </div>
      </div>
    </div>
  );
}
