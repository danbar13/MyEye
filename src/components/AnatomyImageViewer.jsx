import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Info, CheckCircle2 } from 'lucide-react';

const ANATOMY_HOTSPOTS = [
  {
    id: 'Cornea',
    label: 'קרנית',
    left: 17,
    top: 48,
    subtitle: 'כיפה שקופה קדמית'
  },
  {
    id: 'Iris_Pupil',
    label: 'אישון וקשתית',
    left: 28,
    top: 48,
    subtitle: 'ויסות כמות האור'
  },
  {
    id: 'Lens',
    label: 'העדשה',
    left: 38,
    top: 48,
    subtitle: 'מיקוד קריסטלי וקטרקט'
  },
  {
    id: 'Vitreous',
    label: 'הגוף הזגוגי',
    left: 47,
    top: 48,
    subtitle: 'ג׳ל הזגוגית הפנימי'
  },
  {
    id: 'Sclera',
    label: 'לובן העין',
    left: 59,
    top: 32,
    subtitle: 'מעטפת ההגנה ואתר Pars Plana'
  },
  {
    id: 'Choroid',
    label: 'הדמית',
    left: 69,
    top: 38,
    subtitle: 'שכבת כלי הדם המזינה'
  },
  {
    id: 'Retina',
    label: 'הרשתית',
    left: 81,
    top: 36,
    subtitle: 'קליטת האור והאותות'
  },
  {
    id: 'Macula',
    label: 'המקולה',
    left: 85,
    top: 53,
    subtitle: 'מרכז הראייה החדה ומוקד CME'
  },
  {
    id: 'Optic_Nerve',
    label: 'עצב הראייה',
    left: 91,
    top: 61,
    subtitle: 'הולכת האותות למוח'
  }
];

export default function AnatomyImageViewer({ selectedPart, onSelectPart, isDark }) {
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%, 1.25, 1.5, 2
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Smooth mouse-wheel zoom support
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.20 : -0.20;
      setZoomLevel((prev) => {
        const next = Math.min(2.5, Math.max(1, prev + delta));
        if (next === 1) setPan({ x: 0, y: 0 });
        return Math.round(next * 100) / 100;
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.25, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = (e) => {
    e.stopPropagation();
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag-to-pan handlers when zoomed in
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    setIsPanning(true);
    startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isPanning || zoomLevel <= 1) return;
    const maxPan = (zoomLevel - 1) * 350;
    const newX = Math.max(-maxPan, Math.min(maxPan, e.clientX - startPanRef.current.x));
    const newY = Math.max(-maxPan, Math.min(maxPan, e.clientY - startPanRef.current.y));
    setPan({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="w-full h-full relative flex items-center justify-center p-1 sm:p-2 md:p-3 overflow-hidden select-none bg-slate-100/70 dark:bg-[#070a12] transition-colors"
    >
      {/* Floating Top-Left Zoom Controls Toolbar */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 flex items-center gap-1 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
        <button
          onClick={handleZoomIn}
          disabled={zoomLevel >= 2.5}
          className="p-1.5 sm:p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="הגדל תמונה (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          className="px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
          title="אפס גודל (100%)"
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel <= 1}
          className="p-1.5 sm:p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="הקטן תמונה (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        {zoomLevel > 1 && (
          <button
            onClick={handleResetZoom}
            className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="איפוס מבט"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Medical Illustration Container - Scaled to Fill Maximum Viewport */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          aspectRatio: '2752 / 1536',
          cursor: zoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default'
        }}
        className="relative max-w-full max-h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/90 shadow-2xl bg-[#f9fafc] dark:bg-[#070a12] transition-all flex items-center justify-center m-auto"
      >
        {/* Zoom & Pan Container: Scales both the Image and the Hotspots together */}
        <div
          style={{
            transform: `scale(${zoomLevel}) translate(${pan.x / zoomLevel}px, ${pan.y / zoomLevel}px)`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Authentic High-Resolution Hebrew Medical Reference Image */}
          <img
            src={isDark ? "/images/eye_reference.jpg" : "/images/eye_reference_light.jpg"}
            onError={(e) => {
              if (!e.target.src.endsWith('/images/eye_reference.jpg')) {
                e.target.src = '/images/eye_reference.jpg';
              }
            }}
            alt="מבנה העין האנושית - שכבות מופרדות"
            className="w-full h-full object-contain pointer-events-none select-none"
          />

          {/* Interactive 2D Percentage-Based Hotspots Layer */}
          <div className="absolute inset-0 pointer-events-auto">
            {ANATOMY_HOTSPOTS.map((h) => {
              const isSelected = selectedPart === h.id || (selectedPart === 'Fovea' && h.id === 'Macula');
              const isHovered = hoveredHotspot === h.id;

              return (
                <div
                  key={h.id}
                  style={{ left: `${h.left}%`, top: `${h.top}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPart(isSelected ? null : h.id);
                  }}
                  onMouseEnter={() => setHoveredHotspot(h.id)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30 touch-manipulation p-1.5"
                >
                  {/* Outer Pulsing Halo */}
                  <span
                    className={`absolute -inset-1 sm:-inset-2 rounded-full transition-all duration-300 pointer-events-none ${
                      isSelected
                        ? 'bg-sky-400 opacity-75 animate-ping'
                        : isHovered
                        ? 'bg-sky-400/50 opacity-60 scale-125'
                        : 'bg-sky-500/25 opacity-40 animate-pulse'
                    }`}
                  />

                  {/* Central Jewel Dot Pin */}
                  <div
                    className={`relative w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-125 ${
                      isSelected
                        ? 'bg-sky-500 ring-4 ring-sky-300/80 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-125 shadow-sky-500/90'
                        : isHovered
                        ? 'bg-sky-400 ring-2 ring-sky-500 scale-110 shadow-sky-400/60'
                        : 'bg-sky-500 ring-2 ring-white/90 dark:ring-white/80 shadow-md'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white pointer-events-none" />
                  </div>

                  {/* Floating Badge (Shown on Hover or when Selected) */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black whitespace-nowrap transition-all duration-200 pointer-events-none flex flex-col items-center gap-0.5 shadow-xl border backdrop-blur-md z-40 ${
                      isSelected
                        ? 'bg-sky-600/95 text-white border-sky-300 shadow-sky-500/40 scale-105 opacity-100'
                        : isHovered
                        ? 'bg-slate-900/95 text-white border-sky-400 shadow-lg scale-100 opacity-100'
                        : 'opacity-0 scale-90 translate-y-1'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-sky-400'}`} />
                      <span className="text-[11px] sm:text-[12px]">{h.label}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[9px] sm:text-[10px] font-normal text-sky-100">
                        {h.subtitle}
                      </span>
                    )}
                    {/* Downward Pointer Triangle */}
                    <div
                      className={`w-2 h-2 rotate-45 -mb-1 mt-0.5 border-r border-b ${
                        isSelected
                          ? 'bg-sky-600 border-sky-300'
                          : 'bg-slate-900 border-sky-400'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom Discreet Interaction Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-md flex items-center gap-1.5 max-w-[90vw] truncate">
        <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
        <span className="truncate">לחץ על כל שכבה באיור להצגת פירוט והשפעה קלינית בפאנל</span>
      </div>
    </div>
  );
}
