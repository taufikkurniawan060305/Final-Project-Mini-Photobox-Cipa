import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, RefreshCw, Layers, Palette, Sliders, Type, Heart } from 'lucide-react';

const THEMES = [
  { 
    id: 'white', 
    name: 'Off-White Minimalist', 
    hex: '#F9F9FB', 
    text: '#262626', 
    border: 'rgba(0, 0, 0, 0.06)',
    customBg: { backgroundColor: '#F9F9FB' }
  },
  { 
    id: 'charcoal', 
    name: 'Charcoal Minimalist', 
    hex: '#1E1E1E', 
    text: '#FAF9F6', 
    border: 'rgba(255, 255, 255, 0.1)',
    customBg: { backgroundColor: '#1E1E1E' }
  },
  { 
    id: 'redbull', 
    name: 'Red Bull Racing F1 🏁', 
    hex: '#0A1128', // Navy
    text: '#FFFFFF', 
    border: 'rgba(255, 255, 255, 0.12)',
    customBg: { backgroundColor: '#0A1128' }
  },
  { 
    id: 'blue-picnic', 
    name: 'Blue Picnic Vibes 🧺', 
    hex: '#FAF9F6', 
    text: '#1E3A8A', 
    border: 'rgba(30, 58, 138, 0.12)',
    customBg: {
      backgroundColor: '#FFFFFF',
      backgroundImage: 'linear-gradient(90deg, rgba(176, 203, 233, 0.4) 50%, transparent 50%), linear-gradient(rgba(176, 203, 233, 0.4) 50%, transparent 50%)',
      backgroundSize: '24px 24px'
    }
  },
  { 
    id: 'vintage-candy', 
    name: 'Vintage Candy 🍬', 
    hex: '#FAF6EE', 
    text: '#4A3E3D', 
    border: 'rgba(74, 62, 61, 0.15)',
    customBg: { backgroundColor: '#FAF6EE' }
  },
  { 
    id: 'y2k-pink', 
    name: 'Y2K Sparkle Pink ✨', 
    hex: '#FFF0F2', 
    text: '#D81B60', 
    border: 'rgba(216, 27, 96, 0.15)',
    customBg: { backgroundColor: '#FFF0F2' }
  },
  { 
    id: 'snap-joy', 
    name: 'Retro Green Checker 🌟', 
    hex: '#1E3F2E', 
    text: '#FDE047', 
    border: 'rgba(253, 224, 71, 0.15)',
    customBg: { backgroundColor: '#1E3F2E' }
  }
];

const FILTERS = [
  { id: 'original', name: 'Original', style: 'none' },
  { id: 'bw', name: 'Cinematic B&W', style: 'grayscale(100%) contrast(120%) brightness(105%)' },
  { id: 'warm', name: 'Warm Vintage', style: 'sepia(30%) contrast(95%) saturate(95%) brightness(102%)' },
  { id: 'cold', name: 'Cold Chrome', style: 'saturate(115%) hue-rotate(185deg) contrast(108%) brightness(100%)' }
];

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
  const printRef = useRef(null);

  const handleDownload = async () => {
    if (!printRef.current || isExporting) return;
    setIsExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(printRef.current, {
        scale: 3, // High DPI
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `cipa-miniphotobox-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate photostrip image:", err);
      alert("Something went wrong while exporting the image. Please try again.");
    } finally {
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
                onClick={() => setLayout('vertical')}
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
                      backgroundImage: theme.id === 'blue-picnic' ? 'linear-gradient(45deg, #b0cbe9 25%, #faf9f6 25%, #faf9f6 50%, #b0cbe9 50%, #b0cbe9 75%, #faf9f6 75%)' : 'none',
                      backgroundSize: theme.id === 'blue-picnic' ? '6px 6px' : 'none'
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
                  padding: layout === 'vertical' ? '18px' : '22px',
                  transition: 'background-color 0.4s ease, color 0.4s ease'
                }}
              >
                
                {/* Red Bull F1 Theme Custom Graphics */}
                {selectedTheme.id === 'redbull' && (
                  <>
                    {/* Checkerboard flags at top and bottom */}
                    <div className="absolute top-0 left-0 w-full h-3 flex overflow-hidden opacity-95 z-20">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className={`w-[13.5px] h-full ${i % 2 === 0 ? 'bg-[#FFCC00]' : 'bg-[#0A1128]'}`} />
                      ))}
                    </div>
                    {/* Red & Yellow Racing Stripe on Left Edge */}
                    <div className="absolute top-0 left-0 w-2.5 h-full bg-[#E01E37] z-20" />
                    <div className="absolute top-0 left-2.5 w-1.5 h-full bg-[#FFCC00] z-20" />
                    
                    {/* Red Bull Racing Text Badge */}
                    <div className="absolute bottom-[80px] right-4 flex flex-col items-end opacity-85 z-20 select-none">
                      <span className="text-[8px] font-bold tracking-widest text-[#E01E37] leading-none uppercase">RED BULL</span>
                      <span className="text-[10px] font-extrabold tracking-wider text-[#FFCC00] leading-none uppercase">RACING</span>
                    </div>
                  </>
                )}

                {/* Blue Picnic Vibes Custom Graphics */}
                {selectedTheme.id === 'blue-picnic' && (
                  <>
                    {/* Retro star decals */}
                    <div className="absolute top-6 left-5 text-[#FFCC00] text-lg font-bold select-none z-10 filter drop-shadow-sm">★</div>
                    <div className="absolute top-4 left-9 text-[#FFCC00] text-xs font-bold select-none z-10 filter drop-shadow-sm">★</div>
                    
                    <div className="absolute bottom-[88px] right-5 text-[#FFCC00] text-lg font-bold select-none z-10 filter drop-shadow-sm">★</div>
                    <div className="absolute bottom-[102px] right-9 text-[#FFCC00] text-xs font-bold select-none z-10 filter drop-shadow-sm">★</div>
                    
                    {/* Vibes Check Banner Above Footer */}
                    <div className="absolute bottom-[84px] left-0 w-full h-6 flex items-center justify-center border-t border-b border-blue-900/10 bg-sky-200/20 z-10">
                      <span className="text-[9px] font-bold tracking-[0.2em] text-blue-900/70 uppercase">
                        VIBES & CHILL
                      </span>
                    </div>
                  </>
                )}

                {/* Vintage Candy Theme Custom Graphics */}
                {selectedTheme.id === 'vintage-candy' && (
                  <>
                    {/* Striped retro header */}
                    <div className="absolute top-0 left-0 w-full h-4 flex overflow-hidden z-10">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className={`flex-grow h-full ${i % 2 === 0 ? 'bg-[#963D3C]' : 'bg-[#FAF6EE]'}`} />
                      ))}
                    </div>
                    {/* Striped retro footer */}
                    <div className="absolute bottom-0 left-0 w-full h-4 flex overflow-hidden z-10">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className={`flex-grow h-full ${i % 2 === 0 ? 'bg-[#963D3C]' : 'bg-[#FAF6EE]'}`} />
                      ))}
                    </div>
                  </>
                )}

                {/* Y2K Sparkle Pink Graphics */}
                {selectedTheme.id === 'y2k-pink' && (
                  <>
                    <span className="absolute top-8 left-6 text-pink-600 text-lg z-10 animate-pulse">✦</span>
                    <span className="absolute top-5 left-10 text-pink-400 text-xs z-10">✦</span>
                    <span className="absolute bottom-[98px] right-6 text-pink-600 text-lg z-10 animate-pulse">✦</span>
                    <span className="absolute bottom-[113px] right-10 text-pink-400 text-xs z-10">✦</span>
                  </>
                )}

                {/* Retro Checker Green Custom Graphics */}
                {selectedTheme.id === 'snap-joy' && (
                  <>
                    <div className="absolute top-6 left-6 text-yellow-300 text-base z-10">★</div>
                    <div className="absolute bottom-[98px] right-6 text-yellow-300 text-base z-10">★</div>
                    {/* Black & White Checkered border above footer */}
                    <div className="absolute bottom-[80px] left-0 w-full h-5 flex overflow-hidden border-t border-b border-black/30 z-10">
                      {Array.from({ length: 18 }).map((_, i) => (
                        <div key={i} className={`flex-grow h-full ${i % 2 === 0 ? 'bg-[#FAF9F6]' : 'bg-[#1E1E1E]'}`} />
                      ))}
                    </div>
                  </>
                )}
                
                {/* 4-Strip Vertical Layout */}
                {layout === 'vertical' && (
                  <div className="flex flex-col gap-3.5 h-[740px] justify-between pt-2">
                    {photos.slice(0, 4).map((src, index) => (
                      <div
                        key={index}
                        className={`w-[284px] h-[174px] overflow-hidden bg-[#E2E8F0] shadow-sm relative flex-shrink-0 transition-all ${
                          selectedTheme.id === 'vintage-candy' 
                            ? 'border-4 border-double border-[#4A3E3D]/50 p-1 bg-[#FAF6EE]' 
                            : ''
                        }`}
                        style={{ 
                          border: selectedTheme.id !== 'vintage-candy' ? `1px solid ${selectedTheme.border}` : undefined,
                          paddingLeft: selectedTheme.id === 'redbull' ? '12px' : undefined // shift from red/yellow stripes
                        }}
                      >
                        <img
                          src={src}
                          alt={`Frame ${index + 1}`}
                          className="w-full h-full object-cover scale-x-[-1]"
                          style={{ filter: selectedFilter.style }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 2x2 Modern Grid Layout */}
                {layout === 'grid' && (
                  <div className="grid grid-cols-2 gap-3.5 h-[460px] content-start pt-2">
                    {photos.slice(0, 4).map((src, index) => (
                      <div
                        key={index}
                        className={`w-[201px] h-[218px] overflow-hidden bg-[#E2E8F0] shadow-sm relative transition-all ${
                          selectedTheme.id === 'vintage-candy' 
                            ? 'border-4 border-double border-[#4A3E3D]/50 p-1 bg-[#FAF6EE]' 
                            : ''
                        }`}
                        style={{ 
                          border: selectedTheme.id !== 'vintage-candy' ? `1px solid ${selectedTheme.border}` : undefined,
                          paddingLeft: (selectedTheme.id === 'redbull' && index % 2 === 0) ? '8px' : undefined
                        }}
                      >
                        <img
                          src={src}
                          alt={`Frame ${index + 1}`}
                          className="w-full h-full object-cover scale-x-[-1]"
                          style={{ filter: selectedFilter.style }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Branding footer */}
                <div 
                  className={`flex flex-col items-center justify-center text-center ${
                    layout === 'vertical' ? 'h-[80px]' : 'h-[60px] mt-2'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 opacity-70">
                    <Heart className="w-3 h-3 fill-current" />
                  </div>

                  <h4 
                    className="font-serif text-sm tracking-[0.2em] font-bold uppercase leading-none mb-1"
                    style={{ color: selectedTheme.text }}
                  >
                    {studioName || 'CIPA STUDIO ❤️'}
                  </h4>
                  
                  <p 
                    className="text-[10px] tracking-widest font-light opacity-65"
                    style={{ color: selectedTheme.text }}
                  >
                    {dateStr || '2026.06.23'}
                  </p>
                </div>

              </div>
              {/* END OF FIXED SIZE ELEMENT */}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
