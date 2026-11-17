import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Activity,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  LineChart,
  Eye,
  ShieldCheck,
  TrendingDown,
  AlertTriangle,
  Maximize2
} from 'lucide-react';

export default function ChartModal({ isOpen, onClose }) {
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%, 1.25, 1.5, 2

  // Reset zoom whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[96vh] flex flex-col overflow-hidden animate-scaleUp transition-all"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/90 select-none">
          {/* Title and subtitle */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200 dark:border-sky-800/80 flex-shrink-0">
              <LineChart className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 truncate">
                  תרשים מעקב כרונולוגי: תנודות עובי הרשתית (OCT) 2021–2026
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  עין שמאל מול עין ימין
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                ניתוח אורך רפואי של תת-שדה מקולרי מרכזי (CST) בהשפעת מחזורי בצקת CME, שתלי אוזורדקס, אנטי-VEGF וקטרקט
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Zoom Controls */}
            <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-0.5 shadow-sm text-xs">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.75}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="הקטן תצוגה (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2 py-1 font-bold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-[11px]"
                title="אפס גודל (100%)"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2.5}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="הגדל תצוגה (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Open in separate tab */}
            <a
              href="/retinal-thickness-longitudinal-chart.png"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-400 dark:hover:border-sky-500 shadow-sm transition-all text-xs font-bold flex items-center gap-1.5"
              title="פתח תרשים ברזולוציה מקורית מלאה (2871x1551)"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">פתיחה בטאב נפרד</span>
            </a>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-sm transition-all"
              title="סגור (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Image Display Area */}
        <div className="flex-1 overflow-auto p-3 sm:p-5 bg-slate-100/70 dark:bg-slate-950 flex flex-col items-center justify-center relative min-h-[350px]">
          <div
            onClick={() => setZoomLevel((prev) => (prev === 1 ? 1.5 : 1))}
            className={`transition-transform duration-200 ease-out origin-center bg-white rounded-xl shadow-md border border-slate-300 dark:border-slate-700/80 p-2 sm:p-3 overflow-hidden flex items-center justify-center ${
              zoomLevel === 1 ? 'cursor-zoom-in' : 'cursor-zoom-out'
            }`}
            title={zoomLevel === 1 ? 'לחץ להגדלת התרשים (150%)' : 'לחץ להחזרת הגודל המקורי (100%)'}
            style={{
              transform: `scale(${zoomLevel})`,
              maxWidth: zoomLevel === 1 ? '100%' : 'none'
            }}
          >
            <img
              src="/retinal-thickness-longitudinal-chart.png"
              alt="Longitudinal OCT Analysis Chart 2021-2026"
              className="w-full max-h-[58vh] object-contain block select-none pointer-events-auto"
            />
          </div>

          {/* Hint indicator */}
          <div className="absolute bottom-2 right-4 text-[11px] text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm pointer-events-none select-none flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3 text-sky-500" />
            <span>לחץ על התרשים להגדלה מהירה | בקרי ה-Zoom למעלה | פתיחה בלשונית נפרדת (2871x1551)</span>
          </div>
        </div>

        {/* Clinical Key Takeaways Breakdown (Footer Cards) */}
        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs select-none">
          <div className="font-black text-slate-900 dark:text-slate-100 mb-2.5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <span className="text-xs sm:text-sm">עיקרי הממצאים הקליניים והתובנות הטיפוליות מהתרשים:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Box 1: OD Healthy Control */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-amber-200/80 dark:border-amber-900/60 shadow-sm hover:border-amber-400 transition-colors">
              <div className="flex items-center gap-1.5 mb-1 text-amber-700 dark:text-amber-400 font-extrabold text-[12px]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block flex-shrink-0"></span>
                <span>עין ימין (OD) - קו כתום:</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                יציבות פיזיולוגית מושלמת סביב <strong className="text-amber-700 dark:text-amber-300">275–282 µm</strong> לאורך 5 שנות המעקב. מהווה הוכחה מדעית שהפגיעה ממוקמת אך ורק בעין שמאל.
              </p>
            </div>

            {/* Box 2: Ozurdex Response */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-purple-200/80 dark:border-purple-900/60 shadow-sm hover:border-purple-400 transition-colors">
              <div className="flex items-center gap-1.5 mb-1 text-purple-700 dark:text-purple-400 font-extrabold text-[12px]">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block flex-shrink-0"></span>
                <span>תגובה מובהקת לאוזורדקס:</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                צניחה חדה בעובי הרשתית עד <strong className="text-purple-700 dark:text-purple-300">341–348 µm</strong> (ייבוש של 117µm ויותר בתוך שבועות), המוכיחה רגישות מצוינת לסטרואיד תוך-עיני.
              </p>
            </div>

            {/* Box 3: Anti-VEGF Resistance */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-sky-200/80 dark:border-sky-900/60 shadow-sm hover:border-sky-400 transition-colors">
              <div className="flex items-center gap-1.5 mb-1 text-sky-700 dark:text-sky-400 font-extrabold text-[12px]">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block flex-shrink-0"></span>
                <span>עמידות יחסית לאנטי-VEGF:</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                תחת 4 הזרקות וביסמו הבצקת נותרה עקשנית (<strong className="text-sky-700 dark:text-sky-300">500–565 µm</strong>), מה שהוביל להחלטה קלינית לשוב למשטר שתלי אוזורדקס.
              </p>
            </div>

            {/* Box 4: Cataract Surgery */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-emerald-200/80 dark:border-emerald-900/60 shadow-sm hover:border-emerald-400 transition-colors">
              <div className="flex items-center gap-1.5 mb-1 text-emerald-700 dark:text-emerald-400 font-extrabold text-[12px]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block flex-shrink-0"></span>
                <span>ניתוח קטרקט משולב (2026):</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                החלפת העדשה (Phaco + PCIOL) לוותה בשתל אוזורדקס מגן מראש (<strong className="text-emerald-700 dark:text-emerald-300">Protective Implant</strong>) למניעת התלקחות בצקת CME.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
