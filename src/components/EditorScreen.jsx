import React, { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { Download, RefreshCw, Layers, Palette, Sliders, Type } from 'lucide-react';

const THEMES = [
  { 
    id: 'redbull', 
    name: 'Red Bull Racing F1 🏁', 
    hex: '#091024',
    text: '#FFFFFF', 
    border: '#D11933',
    customBg: { backgroundColor: '#091024' }
  },
  { 
    id: 'retro-film', 
    name: 'Retro Film Strip 🎞️', 
    hex: '#0A0A0A',
    text: '#E5E5E5', 
    border: '#2A2A2A',
    customBg: { backgroundColor: '#0A0A0A' }
  },
  { 
    id: 'vintage-news', 
    name: 'Vintage Newspaper 📰', 
    hex: '#F1ECE3',
    text: '#111111', 
    border: '#111111',
    customBg: { backgroundColor: '#F1ECE3' }
  },
  { 
    id: 'retro-checker', 
    name: '90s Checkerboard 🏁', 
    hex: '#111111',
    text: '#FFFFFF', 
    border: '#111111',
    customBg: { backgroundColor: '#FAF9F6' }
  },
  { 
    id: 'vhs-tape', 
    name: '90s VHS Camcorder 📼', 
    hex: '#161618',
    text: '#D1D1D6', 
    border: '#2E2E33',
    customBg: { backgroundColor: '#141416' }
  },
  { 
    id: 'retro-comic', 
    name: 'Retro Comic/Zine 📖', 
    hex: '#FAF9F6',
    text: '#111111', 
    border: '#111111',
    customBg: {
      backgroundColor: '#FAF9F6',
      backgroundImage: 'radial-gradient(#d3d1cb 1.2px, transparent 0)',
      backgroundSize: '12px 12px'
    }
  },
  { 
    id: 'postage-stamp', 
    name: 'Vintage Stamp ✉️', 
    hex: '#F4F0E6',
    text: '#222222', 
    border: '#222222',
    customBg: { backgroundColor: '#F4F0E6' }
  },
  { 
    id: 'retro-band', 
    name: 'Retro Band Flyer 🎸', 
    hex: '#1A1A1A',
    text: '#F2F2F2', 
    border: '#1A1A1A',
    customBg: { backgroundColor: '#161616' }
  },
  { 
    id: 'polaroid-classic', 
    name: 'Polaroid Classic 📸', 
    hex: '#F6F5F2',
    text: '#222222', 
    border: 'rgba(0, 0, 0, 0.08)',
    customBg: { backgroundColor: '#F6F5F2' }
  },
  { 
    id: 'cyber-grid', 
    name: 'Dot-Matrix Cyberpunk 🖥️', 
    hex: '#1E1F22',
    text: '#E5E5E5', 
    border: '#3C4043',
    customBg: {
      backgroundColor: '#1E1F22',
      backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 0)',
      backgroundSize: '16px 16px'
    }
  }
];

const FILTERS = [
  { id: 'original', name: 'Original', style: 'none' },
  { id: 'bw', name: 'Cinematic B&W', style: 'grayscale(100%) contrast(120%) brightness(105%)' },
  { id: 'warm', name: 'Warm Vintage', style: 'sepia(30%) contrast(95%) saturate(95%) brightness(102%)' },
  { id: 'cold', name: 'Cold Chrome', style: 'saturate(115%) hue-rotate(185deg) contrast(108%) brightness(100%)' }
];

const getPhotoWidth = (themeId, layout) => {
  if (layout === 'vertical') {
    switch (themeId) {
      case 'redbull': return '272px';
      case 'retro-film': return '248px';
      case 'vintage-news': return '276px';
      case 'retro-checker': return '256px';
      case 'vhs-tape': return '276px';
      case 'retro-comic': return '276px';
      case 'postage-stamp': return '272px';
      case 'retro-band': return '272px';
      case 'polaroid-classic': return '284px';
      case 'cyber-grid': return '284px';
      default: return '284px';
    }
  } else {
    // grid layout
    switch (themeId) {
      case 'redbull': return '196px';
      case 'retro-film': return '184px';
      case 'vintage-news': return '202px';
      case 'retro-checker': return '188px';
      case 'vhs-tape': return '202px';
      case 'retro-comic': return '202px';
      case 'postage-stamp': return '196px';
      case 'retro-band': return '200px';
      case 'polaroid-classic': return '202px';
      case 'cyber-grid': return '202px';
      default: return '202px';
    }
  }
};

const getPhotoHeight = (themeId, layout) => {
  if (layout === 'vertical') {
    switch (themeId) {
      case 'redbull': return '146px';
      case 'retro-film': return '152px';
      case 'vintage-news': return '158px';
      case 'retro-checker': return '154px';
      case 'vhs-tape': return '156px';
      case 'retro-comic': return '152px';
      case 'postage-stamp': return '154px';
      case 'retro-band': return '152px';
      case 'polaroid-classic': return '158px';
      case 'cyber-grid': return '164px';
      default: return '164px';
    }
  } else {
    // grid layout
    switch (themeId) {
      case 'redbull': return '172px';
      case 'retro-film': return '170px';
      case 'vintage-news': return '186px';
      case 'retro-checker': return '180px';
      case 'vhs-tape': return '184px';
      case 'retro-comic': return '180px';
      case 'postage-stamp': return '180px';
      case 'retro-band': return '176px';
      case 'polaroid-classic': return '190px';
      case 'cyber-grid': return '190px';
      default: return '190px';
    }
  }
};

export default function EditorScreen({ photos, onRetake }) {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [layout, setLayout] = useState('vertical'); // 'vertical' or 'grid'
  const [studioName, setStudioName] = useState('CIPA STUDIO ❤️');
  const [dateStr, setDateStr] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportedImage, setExportedImage] = useState(null);
  const printRef = useRef(null);

  const handleDownload = async () => {
    if (!printRef.current || isExporting) return;
    setIsExporting(true);
    
    let container = null;
    try {
      // Ensure all custom Google fonts are fully loaded prior to capture
      if (document.fonts) {
        await document.fonts.ready;
      }
      
      // Wait for all images inside printRef to be fully loaded and decoded
      const images = printRef.current.querySelectorAll('img');
      const loadPromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.all(loadPromises);
      
      // Clone the target element for clean, unscaled rendering offscreen
      const targetElement = printRef.current;
      const clone = targetElement.cloneNode(true);
      
      // Setup a temporary off-screen container at 1:1 scale
      container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0px';
      container.style.width = layout === 'vertical' ? '320px' : '460px';
      container.style.height = layout === 'vertical' ? '860px' : '580px';
      container.style.transform = 'none';
      container.style.transition = 'none';
      
      // Ensure the cloned photostrip itself is rendered at full 1:1 scale
      clone.style.transform = 'none';
      clone.style.transition = 'none';
      clone.style.width = layout === 'vertical' ? '320px' : '460px';
      clone.style.height = layout === 'vertical' ? '860px' : '580px';
      
      container.appendChild(clone);
      document.body.appendChild(container);
      
      // Small pause to allow the browser to register offscreen layout and paint
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Generate PNG using html-to-image at high resolution (pixelRatio: 3)
      // This uses SVG foreignObject, rendering oklch colors, filters, writingMode vertical, and transforms natively
      const dataUrl = await htmlToImage.toPng(clone, {
        pixelRatio: 3,
        style: {
          transform: 'none',
          left: '0',
          top: '0',
        },
        width: layout === 'vertical' ? 320 : 460,
        height: layout === 'vertical' ? 860 : 580,
        cacheBust: true,
      });
      
      setExportedImage(dataUrl);
      
      // Attempt automatic download (works across desktop browsers)
      const link = document.createElement('a');
      link.download = `cipa-miniphotobox-${Date.now()}.png`;
      link.href = dataUrl;
      
      // Append to DOM for Safari / Firefox click trigger compatibility
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to generate photostrip image:", err);
      alert("Pemberitahuan: Terjadi kendala saat merender gambar. Silakan coba kembali atau gunakan tangkapan layar (screenshot).");
    } finally {
      // Remove the off-screen container from DOM
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-4 flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={onRetake}
          className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Retake / Foto Ulang
        </button>
        <span className="text-xs tracking-widest text-amber-200/60 uppercase">
          Customize & Download
        </span>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls - Left side */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full glass rounded-3xl p-6 border border-white/5 order-2 lg:order-1">
          
          {/* Section 1: Layout Selector */}
          <div>
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase flex items-center gap-2 mb-3">
              <Layers className="w-3.5 h-3.5" />
              1. Layout / Tata Letak
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setLayout('vertical');
                }}
                className={`py-3 px-4 rounded-xl border text-xs font-medium tracking-wide transition-all ${
                  layout === 'vertical'
                    ? 'border-amber-300 bg-amber-300/5 text-white'
                    : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                }`}
              >
                Classic 4-Strip
              </button>
              <button
                onClick={() => setLayout('grid')}
                className={`py-3 px-4 rounded-xl border text-xs font-medium tracking-wide transition-all ${
                  layout === 'grid'
                    ? 'border-amber-300 bg-amber-300/5 text-white'
                    : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                }`}
              >
                2x2 Modern Grid
              </button>
            </div>
          </div>

          {/* Section 2: Frame Concept Selector */}
          <div>
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase flex items-center gap-2 mb-3">
              <Palette className="w-3.5 h-3.5" />
              2. Frame Concept / Desain Bingkai
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    selectedTheme.id === theme.id
                      ? 'border-amber-300 bg-white/5 text-white font-medium shadow-md shadow-amber-300/5'
                      : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                  }`}
                >
                  <span 
                    className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                    style={{ 
                      backgroundColor: theme.hex,
                      backgroundImage: theme.id === 'retro-checker'
                        ? 'linear-gradient(45deg, #111 25%, #fff 25%, #fff 50%, #111 50%, #111 75%, #fff 75%)'
                        : theme.id === 'retro-comic'
                          ? 'radial-gradient(#bbb 1.2px, #fff 0)'
                          : 'none',
                      backgroundSize: theme.id === 'retro-checker' ? '6px 6px' : theme.id === 'retro-comic' ? '4px 4px' : 'none'
                    }}
                  />
                  <span className="text-xs truncate">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Preset Filter */}
          <div>
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase flex items-center gap-2 mb-3">
              <Sliders className="w-3.5 h-3.5" />
              3. Preset Filter
            </label>
            <div className="grid grid-cols-2 gap-3">
              {FILTERS.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter)}
                  className={`py-3 px-4 rounded-xl border text-xs font-medium tracking-wide transition-all ${
                    selectedFilter.id === filter.id
                      ? 'border-amber-300 bg-amber-300/5 text-white'
                      : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Text Customization */}
          <div>
            <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase flex items-center gap-2 mb-3">
              <Type className="w-3.5 h-3.5" />
              4. Branding Text / Teks Custom
            </label>
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[10px] text-gray-500 block mb-1">Studio Name</span>
                <input
                  type="text"
                  maxLength={25}
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value.toUpperCase())}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-300/50"
                  placeholder="e.g. MINIPHOTOBOX CIPA ❤️"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block mb-1">Date</span>
                <input
                  type="text"
                  maxLength={15}
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-300/50"
                  placeholder="e.g. 2026.06.23"
                />
              </div>
            </div>
          </div>

          {/* Export Action */}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className={`w-full py-4 px-6 rounded-full font-semibold tracking-wider text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 ${
                isExporting
                  ? 'bg-amber-300/20 text-amber-300/60 cursor-not-allowed'
                  : 'bg-[#E6DFD3] text-[#121212] hover:bg-white hover:scale-[1.02]'
              }`}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-800/40 border-t-amber-800 rounded-full animate-spin" />
                  <span>Processing high-res PNG...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PNG / Unduh Foto</span>
                </>
              )}
            </button>
            <button
              onClick={onRetake}
              className="w-full py-3 px-6 rounded-full border border-white/10 bg-transparent text-gray-400 hover:text-white hover:bg-white/5 text-xs font-medium transition-all"
            >
              Start Over / Ambil Ulang
            </button>
          </div>

        </div>

        {/* Live Preview Pane */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center w-full min-h-[500px] bg-black/20 rounded-3xl p-6 border border-white/5 order-1 lg:order-2">
          
          <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-4">
            Print Preview
          </div>

          <div className="w-full flex items-center justify-center overflow-auto py-4">
            
            {/* Visual Scaling Wrapper */}
            <div className="origin-top transition-transform duration-300 scale-[0.55] sm:scale-[0.75] md:scale-90 lg:scale-[0.62] xl:scale-[0.85]"
              style={{
                height: layout === 'vertical' ? '860px' : '580px',
                width: layout === 'vertical' ? '320px' : '460px'
              }}>
              
              {/* FIXED SIZE ELEMENT TO BE CAPTURED BY HTML2CANVAS */}
              <div
                ref={printRef}
                id="photo-strip-capture"
                className="shadow-2xl flex flex-col justify-between overflow-hidden relative"
                style={{
                  width: layout === 'vertical' ? '320px' : '460px',
                  height: layout === 'vertical' ? '860px' : '580px',
                  ...selectedTheme.customBg,
                  color: selectedTheme.text,
                  padding: selectedTheme.id === 'redbull'
                    ? (layout === 'vertical' ? '40px 24px 18px 24px' : '52px 24px 18px 24px')
                    : selectedTheme.id === 'retro-film'
                      ? (layout === 'vertical' ? '20px 36px 18px 36px' : '24px 40px 18px 40px')
                      : selectedTheme.id === 'vintage-news'
                        ? (layout === 'vertical' ? '42px 22px 18px 22px' : '48px 22px 18px 22px')
                        : selectedTheme.id === 'retro-checker'
                          ? (layout === 'vertical' ? '20px 32px 18px 32px' : '24px 36px 18px 36px')
                          : selectedTheme.id === 'vhs-tape'
                            ? (layout === 'vertical' ? '32px 22px 18px 22px' : '40px 22px 18px 22px')
                            : selectedTheme.id === 'retro-comic'
                              ? (layout === 'vertical' ? '36px 22px 18px 22px' : '42px 22px 18px 22px')
                              : selectedTheme.id === 'postage-stamp'
                                ? (layout === 'vertical' ? '20px 24px 18px 24px' : '24px 28px 18px 28px')
                                : selectedTheme.id === 'retro-band'
                                  ? (layout === 'vertical' ? '28px 24px 18px 24px' : '32px 24px 18px 24px')
                                  : (layout === 'vertical' ? '18px' : '22px'),
                  transition: 'background-color 0.4s ease, color 0.4s ease'
                }}
              >
                
                {/* Red Bull F1 Theme Custom Graphics */}
                {selectedTheme.id === 'redbull' && (
                  <>
                    {/* Top Center Oracle Red Bull Racing F1 Team header trapezoid */}
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center"
                      style={{
                        width: '210px',
                        height: '46px'
                      }}
                    >
                      {/* Background SVG Polygon for 100% html2canvas compatibility */}
                      <svg width="210" height="46" viewBox="0 0 210 46" className="absolute inset-0 z-0">
                        <path d="M 0,0 L 30,46 L 180,46 L 210,0" fill="#091024" stroke="#D11933" strokeWidth="2" />
                      </svg>
                      
                      {/* Text content positioned on top of the polygon background */}
                      <div className="z-10 flex flex-col items-center justify-center pt-1.5 pb-2">
                        <span className="text-[7px] font-bold tracking-[0.3em] text-white/50 leading-none">ORACLE</span>
                        <span className="text-[9px] font-black tracking-wide text-white leading-none mt-0.5 uppercase">
                          Red Bull <span className="text-[#FFCC00]">RACING</span>
                        </span>
                        <span className="text-[7px] font-bold tracking-[0.25em] text-[#D11933] leading-none mt-0.5">F1 TEAM</span>
                      </div>
                    </div>

                    {/* Red Racing Accent Lines on Left & Right Borders */}
                    <div className="absolute top-0 left-0 w-[4px] h-full bg-[#D11933] z-20" />
                    <div className="absolute top-0 right-0 w-[4px] h-full bg-[#D11933] z-20" />
                    
                    {/* Checkered flag banner at the very top */}
                    <div className="absolute top-0 left-1 w-[calc(100%-8px)] h-2 flex overflow-hidden opacity-90 z-20">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className={`w-[12px] h-full ${i % 2 === 0 ? 'bg-[#FFCC00]' : 'bg-[#091024]'}`} />
                      ))}
                    </div>

                    {/* Checkered flag banner at the very bottom */}
                    <div className="absolute bottom-0 left-1 w-[calc(100%-8px)] h-2 flex overflow-hidden opacity-90 z-20">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className={`w-[12px] h-full ${i % 2 === 0 ? 'bg-[#FFCC00]' : 'bg-[#091024]'}`} />
                      ))}
                    </div>

                    {/* Left vertical border text */}
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[6px] font-semibold tracking-[0.35em] text-white/35 select-none uppercase z-20"
                         style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                      Oracle Red Bull Racing
                    </div>

                    {/* Right vertical border text */}
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[6px] font-semibold tracking-[0.35em] text-white/35 select-none uppercase z-20"
                         style={{ writingMode: 'vertical-rl' }}>
                      Oracle Red Bull Racing
                    </div>
                  </>
                )}

                {/* Retro 35mm Film Strip Custom Graphics */}
                {selectedTheme.id === 'retro-film' && (
                  <>
                    {/* Left sprocket rail */}
                    <div className="absolute left-2.5 top-0 bottom-0 w-3 flex flex-col justify-between py-4 z-20 pointer-events-none">
                      {Array.from({ length: layout === 'vertical' ? 12 : 8 }).map((_, i) => (
                        <div key={i} className="w-2.5 h-4 bg-[#1E1E1E] rounded-[2px] border border-white/10" />
                      ))}
                    </div>
                    {/* Right sprocket rail */}
                    <div className="absolute right-2.5 top-0 bottom-0 w-3 flex flex-col justify-between py-4 z-20 pointer-events-none">
                      {Array.from({ length: layout === 'vertical' ? 12 : 8 }).map((_, i) => (
                        <div key={i} className="w-2.5 h-4 bg-[#1E1E1E] rounded-[2px] border border-white/10" />
                      ))}
                    </div>
                    {/* Kodak film edge info text */}
                    <div className="absolute left-7 top-[15%] text-[7px] font-mono tracking-[0.3em] text-white/35 select-none z-20 uppercase"
                         style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                      KODAK 400TX
                    </div>
                    <div className="absolute left-7 bottom-[15%] text-[7px] font-mono tracking-[0.3em] text-white/35 select-none z-20 uppercase"
                         style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                      SAFETY FILM 24
                    </div>
                    <div className="absolute right-7 top-1/2 -translate-y-1/2 text-[7px] font-mono tracking-[0.3em] text-white/35 select-none z-20 uppercase"
                         style={{ writingMode: 'vertical-rl' }}>
                      ▲ 12A
                    </div>
                  </>
                )}

                {/* Vintage Newspaper Custom Graphics */}
                {selectedTheme.id === 'vintage-news' && (
                  <>
                    {/* Outer double border */}
                    <div className="absolute inset-2 border-4 border-double border-[#111111] pointer-events-none z-10" />
                    {/* Newspaper masthead */}
                    <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-20 border-b border-[#111111] pb-1">
                      <span className="text-[7px] font-serif italic font-bold text-[#111111]">DAILY ARCHIVE</span>
                      <span className="text-[7px] font-mono text-[#111111] tracking-widest">N° 1994</span>
                    </div>
                  </>
                )}

                {/* 90s Checkerboard Skate Custom Graphics */}
                {selectedTheme.id === 'retro-checker' && (
                  <>
                    {/* Left Checkered Column */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col overflow-hidden pointer-events-none z-10">
                      {Array.from({ length: layout === 'vertical' ? 44 : 30 }).map((_, i) => (
                        <div key={i} className={`w-4 h-4 flex-shrink-0 ${i % 2 === 0 ? 'bg-[#111111]' : 'bg-[#FAF9F6]'}`} />
                      ))}
                    </div>
                    {/* Right Checkered Column */}
                    <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col overflow-hidden pointer-events-none z-10">
                      {Array.from({ length: layout === 'vertical' ? 44 : 30 }).map((_, i) => (
                        <div key={i} className={`w-4 h-4 flex-shrink-0 ${i % 2 === 1 ? 'bg-[#111111]' : 'bg-[#FAF9F6]'}`} />
                      ))}
                    </div>
                  </>
                )}

                {/* Dot-Matrix Cyberpunk Custom Graphics */}
                {selectedTheme.id === 'cyber-grid' && (
                  <>
                    {/* Tech details */}
                    <div className="absolute top-4 left-6 text-[8px] font-mono text-white/30 select-none z-20 uppercase">
                      SYS_REC_ON
                    </div>
                    <div className="absolute top-4 right-6 text-[8px] font-mono text-white/30 select-none z-20 uppercase">
                      B&W_MOD
                    </div>
                    {/* Scanning lines aesthetic (subtle) */}
                    <div className="absolute inset-0 pointer-events-none z-10 bg-linear-to-b from-white/1 to-transparent bg-[size:100%_4px]" />
                  </>
                )}

                {/* 90s VHS Camcorder Custom Graphics */}
                {selectedTheme.id === 'vhs-tape' && (
                  <>
                    {/* Play indicator */}
                    <div className="absolute top-4 left-6 flex items-center gap-1.5 text-[8px] font-mono text-emerald-400 select-none z-20">
                      <span className="text-[7px]">▶</span> PLAY
                    </div>
                    {/* VHS status count */}
                    <div className="absolute top-4 right-6 text-right text-[8px] font-mono text-white/50 select-none z-20">
                      <div>SP</div>
                      <div className="mt-0.5">L-CODE 90</div>
                    </div>
                    {/* VHS tracking lines/battery at bottom */}
                    <div className="absolute bottom-[92px] left-6 right-6 flex justify-between items-center text-[7px] font-mono text-white/30 select-none z-20">
                      <span>HI-FI STEREO</span>
                      <span>AUTO TRACKING</span>
                    </div>
                  </>
                )}

                {/* Retro Comic/Zine Custom Graphics */}
                {selectedTheme.id === 'retro-comic' && (
                  <>
                    {/* Top center explosion pop badge */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                      <svg width="60" height="26" viewBox="0 0 60 26" className="filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <polygon 
                          points="5,13 12,2 25,5 30,1 35,5 48,2 55,13 48,24 35,21 30,25 25,21 12,24" 
                          fill="#FAF9F6" 
                          stroke="#111111" 
                          strokeWidth="1.5" 
                        />
                        <text 
                          x="50%" 
                          y="62%" 
                          dominantBaseline="middle" 
                          textAnchor="middle" 
                          className="font-serif italic font-extrabold text-[8px] fill-[#111111] tracking-wider"
                        >
                          SNAP!
                        </text>
                      </svg>
                    </div>
                    {/* Symmetrical comic dots border decoration */}
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-[80%] flex flex-col justify-between opacity-35 z-20 pointer-events-none">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                      ))}
                    </div>
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-[80%] flex flex-col justify-between opacity-35 z-20 pointer-events-none">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                      ))}
                    </div>
                  </>
                )}

                {/* Vintage Postage Stamp Custom Graphics */}
                {selectedTheme.id === 'postage-stamp' && (
                  <>
                    {/* Left perforated stamp holes */}
                    <div className="absolute -left-1.5 top-0 bottom-0 w-3 flex flex-col justify-between py-6 z-20 pointer-events-none">
                      {Array.from({ length: layout === 'vertical' ? 18 : 12 }).map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-[#121212] rounded-full border border-black/5" />
                      ))}
                    </div>
                    {/* Right perforated stamp holes */}
                    <div className="absolute -right-1.5 top-0 bottom-0 w-3 flex flex-col justify-between py-6 z-20 pointer-events-none">
                      {Array.from({ length: layout === 'vertical' ? 18 : 12 }).map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-[#121212] rounded-full border border-black/5" />
                      ))}
                    </div>
                    {/* Circular postmark stamp overlay */}
                    <div className="absolute top-2 right-6 w-12 h-12 rounded-full border border-[#222222]/30 flex flex-col items-center justify-center text-[5px] font-mono text-[#222222]/40 select-none z-20 rotate-12 pointer-events-none">
                      <div className="border-b border-[#222222]/20 w-10 text-center pb-0.5 font-bold">AIR MAIL</div>
                      <div className="pt-0.5 tracking-widest leading-none">POSTAGE</div>
                    </div>
                  </>
                )}

                {/* Retro Band Flyer Custom Graphics */}
                {selectedTheme.id === 'retro-band' && (
                  <>
                    {/* Top Gig Flyer Details */}
                    <div className="absolute top-3.5 left-6 text-[7px] font-mono tracking-widest text-white/50 select-none z-20">
                      [ LIVE STAGE // ALL ACCESS PASS ]
                    </div>
                    <div className="absolute top-3.5 right-6 text-[7px] font-mono tracking-widest text-white/50 select-none z-20">
                      VOL_99
                    </div>
                    {/* Side tour details */}
                    <div className="absolute left-7 top-[48%] -translate-y-1/2 text-[6px] font-mono tracking-[0.4em] text-white/20 select-none z-20 uppercase"
                         style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                      GIG DATE // SOUL & ROCK
                    </div>
                    <div className="absolute right-7 top-[48%] -translate-y-1/2 text-[6px] font-mono tracking-[0.4em] text-white/20 select-none z-20 uppercase"
                         style={{ writingMode: 'vertical-rl' }}>
                      WORLD TOUR OVERDRIVE
                    </div>
                    {/* Barcode graphic at the bottom */}
                    <div className="absolute bottom-[92px] left-6 right-6 flex items-center justify-between pointer-events-none z-20 opacity-30">
                      <div className="flex items-center gap-[1px] h-3 bg-white/20 px-1 py-[1px] rounded">
                        <div className="w-[1px] h-full bg-white" />
                        <div className="w-[2px] h-full bg-white" />
                        <div className="w-[1px] h-full bg-white" />
                        <div className="w-[3px] h-full bg-white" />
                        <div className="w-[1px] h-full bg-white" />
                        <div className="w-[2px] h-full bg-white" />
                        <div className="w-[1px] h-full bg-white" />
                        <div className="w-[1px] h-full bg-white" />
                      </div>
                      <span className="text-[6px] font-mono text-white/50">#00996688</span>
                    </div>
                  </>
                )}
                
                {/* 4-Strip Vertical Layout */}
                {layout === 'vertical' && (
                  <div className="flex flex-col gap-3.5 h-[740px] justify-between pt-2">
                    {photos.slice(0, 4).map((src, index) => (
                      <div
                        key={index}
                        className="flex flex-col flex-shrink-0 items-center"
                        style={{ gap: selectedTheme.id === 'redbull' ? '0px' : '14px' }}
                      >
                        <div
                          className={`overflow-hidden bg-[#E2E8F0] shadow-sm relative transition-all ${
                            selectedTheme.id === 'polaroid-classic' 
                              ? 'p-2 pb-6 bg-white border border-gray-200/60 shadow-[0_4px_10px_rgba(0,0,0,0.06)]' 
                              : selectedTheme.id === 'retro-checker'
                                ? 'p-1.5 bg-white border border-[#111111] shadow-sm'
                                : selectedTheme.id === 'retro-comic'
                                  ? 'p-1 bg-[#FAF9F6] border-2 border-[#111111] shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                                  : selectedTheme.id === 'postage-stamp'
                                    ? 'p-1 bg-[#F4F0E6] border border-dashed border-[#222222] shadow-sm'
                                    : selectedTheme.id === 'retro-band'
                                      ? 'p-1 bg-[#1E1E1E] border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]'
                                      : ''
                          }`}
                          style={{ 
                            border: (selectedTheme.id !== 'polaroid-classic' && selectedTheme.id !== 'retro-checker' && selectedTheme.id !== 'retro-comic' && selectedTheme.id !== 'redbull') 
                              ? `1px solid ${selectedTheme.border}` 
                              : undefined,
                            borderLeft: selectedTheme.id === 'redbull' ? '1px solid #D11933' : undefined,
                            borderRight: selectedTheme.id === 'redbull' ? '1px solid #D11933' : undefined,
                            borderTop: selectedTheme.id === 'redbull' ? '2px solid #D11933' : undefined,
                            width: getPhotoWidth(selectedTheme.id, 'vertical'),
                            height: getPhotoHeight(selectedTheme.id, 'vertical'),
                          }}
                        >
                          {/* Driver tag logic overlay on third frame */}
                          {selectedTheme.id === 'redbull' && index === 2 && (
                            <div className="absolute top-2 left-2 bg-[#091024] border-l-4 border-[#D11933] py-0.5 px-2 text-[7px] font-black text-white tracking-wider uppercase select-none z-10 flex items-center gap-1">
                              <span>{studioName.replace(" ❤️", "") || 'CIPA RACING'}</span>
                              <span className="text-[#FFCC00]">1</span>
                            </div>
                          )}

                          {/* Tape strip overlay */}
                          {selectedTheme.id === 'retro-band' && (
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-14 h-3 bg-white/20 border border-white/5 shadow-xs rotate-[-3deg] backdrop-blur-[1px] z-20 pointer-events-none" />
                          )}

                          {/* Cyber grid bracket accents */}
                          {selectedTheme.id === 'cyber-grid' && (
                            <>
                              <div className="absolute top-1 left-1 text-[8px] font-mono text-white/50 select-none pointer-events-none leading-none">┌</div>
                              <div className="absolute top-1 right-1 text-[8px] font-mono text-white/50 select-none pointer-events-none leading-none">┐</div>
                              <div className="absolute bottom-1 left-1 text-[8px] font-mono text-white/50 select-none pointer-events-none leading-none">└</div>
                              <div className="absolute bottom-1 right-1 text-[8px] font-mono text-white/50 select-none pointer-events-none leading-none">┘</div>
                            </>
                          )}

                          {/* Film frame numbering details */}
                          {selectedTheme.id === 'retro-film' && (
                            <div className="absolute bottom-1 right-1 bg-black/60 text-white/80 font-mono text-[6px] px-1 py-0.5 rounded border border-white/5 z-10 select-none leading-none">
                              #{index + 1}
                            </div>
                          )}

                          <img
                            src={src}
                            alt={`Frame ${index + 1}`}
                            className="w-full h-full object-cover scale-x-[-1]"
                            style={{ filter: selectedFilter.style }}
                          />
                        </div>
                        {/* Red Bull GIVES YOU WINGS label banner */}
                        {selectedTheme.id === 'redbull' && (
                          <div className="w-[272px] bg-[#060A18] border-l border-r border-b border-[#D11933] py-1 flex items-center justify-center select-none">
                            <span className="text-[6px] font-bold tracking-[0.25em] text-[#D11933]">
                              GIVES YOU WINGS
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 2x2 Modern Grid Layout */}
                {layout === 'grid' && (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-3.5 h-[460px] content-start pt-2 px-1 justify-items-center">
                    {photos.slice(0, 4).map((src, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center"
                        style={{ gap: selectedTheme.id === 'redbull' ? '0px' : '10px' }}
                      >
                        <div
                          className={`overflow-hidden bg-[#E2E8F0] shadow-sm relative transition-all ${
                            selectedTheme.id === 'polaroid-classic' 
                              ? 'p-2 pb-5 bg-white border border-gray-250/60 shadow-[0_4px_10px_rgba(0,0,0,0.06)]' 
                              : selectedTheme.id === 'retro-checker'
                                ? 'p-1 bg-white border border-[#111111] shadow-sm'
                                : selectedTheme.id === 'retro-comic'
                                  ? 'p-1 bg-[#FAF9F6] border-2 border-[#111111] shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                                  : selectedTheme.id === 'postage-stamp'
                                    ? 'p-1 bg-[#F4F0E6] border border-dashed border-[#222222] shadow-sm'
                                    : selectedTheme.id === 'retro-band'
                                      ? 'p-1 bg-[#1E1E1E] border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]'
                                      : ''
                          }`}
                          style={{ 
                            border: (selectedTheme.id !== 'polaroid-classic' && selectedTheme.id !== 'retro-checker' && selectedTheme.id !== 'retro-comic' && selectedTheme.id !== 'redbull') 
                              ? `1px solid ${selectedTheme.border}` 
                              : undefined,
                            borderLeft: selectedTheme.id === 'redbull' ? '1px solid #D11933' : undefined,
                            borderRight: selectedTheme.id === 'redbull' ? '1px solid #D11933' : undefined,
                            borderTop: selectedTheme.id === 'redbull' ? '2px solid #D11933' : undefined,
                            width: getPhotoWidth(selectedTheme.id, 'grid'),
                            height: getPhotoHeight(selectedTheme.id, 'grid'),
                          }}
                        >
                          {/* Driver tag logic overlay on third frame */}
                          {selectedTheme.id === 'redbull' && index === 2 && (
                            <div className="absolute top-2 left-2 bg-[#091024] border-l-4 border-[#D11933] py-0.5 px-2 text-[7px] font-black text-white tracking-wider uppercase select-none z-10 flex items-center gap-1 shadow-md">
                              <span>{studioName.replace(" ❤️", "") || 'CIPA RACING'}</span>
                              <span className="text-[#FFCC00]">1</span>
                            </div>
                          )}

                          {/* Tape strip overlay */}
                          {selectedTheme.id === 'retro-band' && (
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-14 h-3 bg-white/20 border border-white/5 shadow-xs rotate-[-3deg] backdrop-blur-[1px] z-20 pointer-events-none" />
                          )}

                          {/* Cyber grid bracket accents */}
                          {selectedTheme.id === 'cyber-grid' && (
                            <>
                              <div className="absolute top-1 left-1 text-[8px] font-mono text-white/50 select-none pointer-events-none leading-none">┌</div>
                              <div className="absolute top-1 right-1 text-[8px] font-mono text-white/50 select-none pointer-events-none leading-none">┐</div>
                              <div className="absolute bottom-1 left-1 text-[8px] font-mono text-white/50 select-none pointer-events-none leading-none">└</div>
                              <div className="absolute bottom-1 right-1 text-[8px] font-mono text-white/50 select-none pointer-events-none leading-none">┘</div>
                            </>
                          )}

                          {/* Film frame numbering details */}
                          {selectedTheme.id === 'retro-film' && (
                            <div className="absolute bottom-1 right-1 bg-black/60 text-white/80 font-mono text-[6px] px-1 py-0.5 rounded border border-white/5 z-10 select-none leading-none">
                              #{index + 1}
                            </div>
                          )}

                          <img
                            src={src}
                            alt={`Frame ${index + 1}`}
                            className="w-full h-full object-cover scale-x-[-1]"
                            style={{ filter: selectedFilter.style }}
                          />
                        </div>
                        {/* Red Bull GIVES YOU WINGS label banner */}
                        {selectedTheme.id === 'redbull' && (
                          <div className="w-[196px] bg-[#060A18] border-l border-r border-b border-[#D11933] py-1 flex items-center justify-center select-none">
                            <span className="text-[6px] font-bold tracking-[0.25em] text-[#D11933]">
                              GIVES YOU WINGS
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Branding footer */}
                <div 
                  className={`flex flex-col items-center justify-center text-center shrink-0 ${
                    layout === 'vertical' ? 'h-[80px]' : 'h-[60px] mt-2'
                  }`}
                >
                  <div className={`flex flex-col items-center justify-center ${
                    selectedTheme.id === 'retro-checker' || selectedTheme.id === 'retro-comic'
                      ? 'bg-white text-[#111111] px-5 py-1.5 border border-[#111111] shadow-[2px_2px_0px_#111] rounded'
                      : selectedTheme.id === 'retro-band'
                        ? 'border border-dashed border-white/20 px-4 py-1.5 bg-[#121212]/50 text-[#F2F2F2] rounded'
                        : ''
                  }`}>
                    {selectedTheme.id === 'redbull' && (
                      <div className="flex items-center justify-center mb-1.5 w-[60px] h-[30px] select-none pointer-events-none">
                        <img 
                          src="./redbull_logo_transparent.png"
                          alt="Red Bull Racing Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    


                    <h4 
                      className={`font-bold uppercase leading-none mb-1 ${
                        selectedTheme.id === 'retro-film' || selectedTheme.id === 'cyber-grid' || selectedTheme.id === 'vhs-tape' || selectedTheme.id === 'retro-band'
                          ? 'font-mono text-xs tracking-widest'
                          : selectedTheme.id === 'redbull'
                            ? 'font-sans font-black text-[11px] tracking-[0.2em]'
                            : selectedTheme.id === 'polaroid-classic'
                              ? 'font-serif italic text-xs lowercase tracking-wider'
                              : selectedTheme.id === 'vintage-news' || selectedTheme.id === 'postage-stamp'
                                ? 'font-serif text-sm tracking-[0.25em]'
                                : 'font-serif text-sm tracking-[0.2em]'
                      }`}
                      style={{ color: (selectedTheme.id === 'retro-checker' || selectedTheme.id === 'retro-comic') ? '#111111' : selectedTheme.text }}
                    >
                      {studioName || 'CIPA STUDIO ❤️'}
                    </h4>
                    
                    <p 
                      className={`text-[9px] tracking-widest font-light opacity-65 ${
                        selectedTheme.id === 'retro-film' || selectedTheme.id === 'cyber-grid' || selectedTheme.id === 'vhs-tape' || selectedTheme.id === 'retro-band'
                          ? 'font-mono'
                          : selectedTheme.id === 'redbull'
                            ? 'font-sans font-bold text-[8px] tracking-[0.15em]'
                            : ''
                      }`}
                      style={{ color: (selectedTheme.id === 'retro-checker' || selectedTheme.id === 'retro-comic') ? '#111111' : (selectedTheme.id === 'redbull' ? '#FFCC00' : selectedTheme.text) }}
                    >
                      {dateStr || '2026.06.23'}
                    </p>
                  </div>
                </div>

              </div>
              {/* END OF FIXED SIZE ELEMENT */}

            </div>
          </div>
        </div>

      </div>

      {/* Modal for Mobile Saving / Image Preview */}
      {exportedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#18181B] border border-white/10 rounded-3xl p-6 max-w-md w-full flex flex-col items-center gap-4 shadow-2xl relative animate-scaleUp">
            
            <button 
              onClick={() => setExportedImage(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
            >
              ✕
            </button>
            
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase text-center mt-2">
              📸 Foto Berhasil Dibuat!
            </h3>
            
            <p className="text-[11px] text-gray-400 text-center max-w-xs leading-relaxed">
              Jika unduhan tidak berjalan otomatis, **tekan lama pada gambar** di bawah ini lalu pilih **"Simpan Gambar" / "Save Image"**.
            </p>
            
            {/* Displayed Image */}
            <div className="w-full flex justify-center py-2 max-h-[50vh] overflow-y-auto">
              <img 
                src={exportedImage} 
                className="max-h-[45vh] w-auto rounded-xl shadow-xl border border-white/15 object-contain"
                alt="Captured photostrip"
              />
            </div>
            
            <div className="w-full flex gap-3 mt-2">
              <button
                onClick={() => setExportedImage(null)}
                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                Tutup / Close
              </button>
              <a
                href={exportedImage}
                download={`cipa-miniphotobox-${Date.now()}.png`}
                className="flex-1 py-3 bg-amber-300 hover:bg-amber-400 text-[#121212] rounded-full text-xs font-semibold text-center shadow-lg transition-all"
              >
                Unduh Lagi
              </a>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
