import React from 'react';
import { Eye, Moon, Sun, RotateCcw, LineChart } from 'lucide-react';

export default function Header({ isDark, onToggleTheme, onResetCamera, onOpenChart }) {
  return (
    <header className="h-14 sm:h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-30 transition-colors flex-shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 flex-shrink-0">
          <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white truncate">
              MyEye
            </h1>
            <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 truncate">
              אפליקציית למידה אנטומית
            </span>
          </div>
          <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 truncate">
            אפיון קליני, פתולוגיית BRVO, בצקת מקולרית, קטרקט ופרוטוקול משולב
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>עין שמאל: BRVO & CME | עין ימין: ביקורת בריאה (200-280µm)</span>
        </div>

        {/* Dedicated Button for OCT Chart */}
        <button
          onClick={onOpenChart}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-sky-300 dark:border-sky-850 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-all text-xs font-extrabold shadow-sm shadow-sky-500/10"
          title="הצג תרשים מעקב OCT כרונולוגי של עובי הרשתית (2021-2026)"
        >
          <LineChart className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span className="hidden xs:inline sm:inline">תרשים OCT</span>
        </button>

        <button
          onClick={onResetCamera}
          className="p-2 sm:p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 transition-all"
          title="אפס מבט מצלמה"
          aria-label="אפס מבט מצלמה"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2 sm:p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 transition-all"
          title={isDark ? "מעבר לתצוגה בהירה" : "מעבר לתצוגה כהה"}
          aria-label="החלף תצוגה כהה / בהירה"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>
    </header>
  );
}
