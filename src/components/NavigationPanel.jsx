import React, { useState } from 'react';
import {
  Eye,
  AlertTriangle,
  Syringe,
  Sparkles,
  HelpCircle,
  Play,
  Zap,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Info,
  X,
  Activity,
  LineChart,
  ZoomIn,
  ExternalLink,
  Calendar,
  ArrowLeftRight,
  Lightbulb,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import medicalData from '../data/medicalContent.json';
import GlossaryText from './GlossaryText';
import GlossaryView from './GlossaryView';

const TAB_ICONS = {
  Eye: Eye,
  AlertTriangle: AlertTriangle,
  Syringe: Syringe,
  Sparkles: Sparkles,
  HelpCircle: HelpCircle,
  BookOpen: BookOpen
};

const TAB_SHORT_LABELS = {
  'anatomy': 'אנטומיה',
  'retina-issue': 'רשתית',
  'treatments': 'טיפולים',
  'cataract': 'קטרקט',
  'future-treatments': 'נוספים',
  'glossary': 'מילון'
};

export default function NavigationPanel({
  activeTab,
  onTabChange,
  selectedPart,
  onSelectPart,
  isSwollen,
  octThickness = 565,
  onSetOctThickness,
  onToggleEdemaMode,
  onToggleEdema,
  onTriggerInjection,
  isInjecting,
  onTriggerLaser,
  isLasering,
  cataractMode,
  onSetCataractMode,
  onPerformCataractSurgery,
  onFocusTreatment,
  onOpenChart
}) {
  const currentTabData = medicalData.tabs.find(t => t.id === activeTab) || medicalData.tabs[0];
  const [expandedTreatment, setExpandedTreatment] = useState('eylea-hd');
  const [isTableExpanded, setIsTableExpanded] = useState(true);
  const selectedPartData = selectedPart ? (medicalData.anatomyParts[selectedPart] || (selectedPart === 'Fovea' ? medicalData.anatomyParts['Fovea'] : null)) : null;

  const toggleAccordion = (id, targetFocus) => {
    setExpandedTreatment(prev => (prev === id ? null : id));
    if (onFocusTreatment && targetFocus) {
      onFocusTreatment(targetFocus);
    }
  };

  return (
    <aside className="h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
      
      {/* 6 Tabs Navigation Bar */}
      <nav className="grid grid-cols-6 p-1.5 gap-1 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        {medicalData.tabs.map((tab) => {
          const IconComponent = TAB_ICONS[tab.icon] || Eye;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm border-b-2 border-sky-500'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={tab.title}
            >
              <IconComponent className={`w-4 h-4 mb-1 ${isActive ? 'scale-110 text-sky-600 dark:text-sky-400' : ''}`} />
              <span className="truncate max-w-full text-[10px] leading-tight">
                {TAB_SHORT_LABELS[tab.id] || tab.title.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Unified Scrollable Container: Contains Selected Layer Card, Tab Header, and All Medical Details */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3 sm:p-4 space-y-4 overscroll-contain scroll-smooth">
        
        {/* Selected Layer Info Card (Opens on direct 3D layer click or hotspot click) */}
        {selectedPartData && (
          <div className="p-3.5 sm:p-4 bg-gradient-to-br from-sky-50 to-indigo-50/80 dark:from-slate-800 dark:to-slate-900 border border-sky-200 dark:border-slate-700 rounded-xl relative animate-fadeIn shadow-md">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {selectedPartData.hebrewName}
                </h3>
              </div>
              <button
                onClick={() => onSelectPart(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700 transition-colors"
                title="סגור פירוט שכבה"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[11px] font-bold text-sky-700 dark:text-sky-300 mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>תפקיד פיזיולוגי: <GlossaryText text={selectedPartData.role} /></span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
              <GlossaryText text={selectedPartData.description} />
            </p>

            <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-sky-100 dark:border-slate-700/80 text-[11px] leading-relaxed text-slate-800 dark:text-slate-200">
              <strong className="text-sky-800 dark:text-sky-300 block mb-0.5 font-bold">
                ⚕️ השפעה קלינית וקשר למצבך:
              </strong>
              <GlossaryText text={selectedPartData.clinicalImpact} />
            </div>
          </div>
        )}

        {/* Tab Header Banner */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 shadow-sm">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md mb-1.5 bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300">
            {currentTabData.badge}
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-1">
            {currentTabData.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <GlossaryText text={currentTabData.summary} />
          </p>
        </div>
        
        {/* TAB 1: Anatomy Interactive Guide (Active when no part is selected) */}
        {activeTab === 'anatomy' && !selectedPartData && (
          <div className="p-4 rounded-xl border border-sky-200/80 dark:border-sky-900/60 bg-gradient-to-br from-sky-50/70 to-indigo-50/50 dark:from-slate-800/60 dark:to-slate-900/60 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-extrabold text-xs">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>איור אנטומי אינטראקטיבי:</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <GlossaryText text="כל שכבות העין מוצגות באיור משמאל לימין לאורך ציר הראייה. לחץ על הנקודות הכחולות הפועמות על גבי האיור כדי לפתוח כאן כרטיס הסבר פיזיולוגי מקיף והשפעה קלינית ישירה על מצב העין שלך (BRVO, בצקת מקולרית, קטרקט ועוד)." />
            </p>
          </div>
        )}

        {/* TAB 2: Retinal Problem Actions */}
        {activeTab === 'retina-issue' && (
          <div className="space-y-3.5">
            {/* Interactive OCT Macular Edema & BRVO Pathology Controls */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-800/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-500" />
                  הדמיית מצב הרשתית והבצקת (OCT):
                </span>
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border transition-all ${
                  octThickness > 280
                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                    : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                }`}>
                  {octThickness > 280 ? `בצקת פעילה (${octThickness}µm)` : `מצב תקין (${octThickness}µm)`}
                </span>
              </div>

              {/* 2-State Segmented Control */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/80">
                <button
                  onClick={() => onToggleEdemaMode ? onToggleEdemaMode('healthy') : onToggleEdema()}
                  className={`py-2 px-2 rounded-lg text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-0.5 ${
                    octThickness <= 280
                      ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-md border border-emerald-300 dark:border-emerald-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${octThickness <= 280 ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    <span>מצב תקין</span>
                  </div>
                  <span className="text-[10px] font-normal opacity-80">(עובי ~240µm)</span>
                </button>

                <button
                  onClick={() => onToggleEdemaMode ? onToggleEdemaMode('swollen') : onToggleEdema()}
                  className={`py-2 px-2 rounded-lg text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-0.5 ${
                    octThickness > 280
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${octThickness > 280 ? 'bg-white animate-ping' : 'bg-slate-400'}`} />
                    <span>בצקת מקולרית</span>
                  </div>
                  <span className="text-[10px] font-normal opacity-90">(BRVO / CME - 565µm)</span>
                </button>
              </div>

              {/* Interactive Continuous OCT Thickness Slider */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-600 dark:text-slate-300">
                    מדד עובי מקולרי מרכזי (CST):
                  </span>
                  <span className={`font-mono font-black text-xs ${
                    octThickness > 400 ? 'text-rose-600 dark:text-rose-400' : octThickness > 280 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {octThickness} µm
                  </span>
                </div>

                <input
                  type="range"
                  min="240"
                  max="565"
                  step="5"
                  value={octThickness}
                  onChange={(e) => onSetOctThickness && onSetOctThickness(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />

                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold px-0.5">
                  <span>240µm (תקין)</span>
                  <span>350µm (קלה)</span>
                  <span>450µm (בינונית)</span>
                  <span>565µm (שיא הבצקת)</span>
                </div>
              </div>
            </div>

            {/* Comparison Highlight Card (Right Eye vs Left Eye) */}
            {currentTabData.comparisonHighlight && (
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-sky-50/50 dark:from-slate-800/80 dark:to-slate-900 shadow-sm space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                  <ArrowLeftRight className="w-4 h-4 text-sky-500" />
                  <span>{currentTabData.comparisonHighlight.title}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                    <div className="font-extrabold text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center justify-between">
                      <span>{currentTabData.comparisonHighlight.od.title}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">{currentTabData.comparisonHighlight.od.thickness}</span>
                    </div>
                    <div className="text-[10px] text-emerald-900 dark:text-emerald-200 leading-snug">
                      <strong>פוביאה: </strong><GlossaryText text={currentTabData.comparisonHighlight.od.fovea} />
                    </div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug">
                      <GlossaryText text={currentTabData.comparisonHighlight.od.status} />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-1">
                    <div className="font-extrabold text-rose-800 dark:text-rose-300 text-[11px] flex items-center justify-between">
                      <span>{currentTabData.comparisonHighlight.os.title}</span>
                      <span className="text-rose-600 dark:text-rose-400 font-black">{currentTabData.comparisonHighlight.os.thickness}</span>
                    </div>
                    <div className="text-[10px] text-rose-900 dark:text-rose-200 leading-snug">
                      <strong>פוביאה: </strong><GlossaryText text={currentTabData.comparisonHighlight.os.fovea} />
                    </div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug">
                      <GlossaryText text={currentTabData.comparisonHighlight.os.status} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OCT Longitudinal Chart Card */}
            <div className="p-3.5 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-white dark:bg-slate-800/80 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                  <LineChart className="w-4 h-4 text-sky-500" />
                  <span>מעקב OCT כרונולוגי: עובי הרשתית</span>
                </div>
                <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-full">
                  2021–2026
                </span>
              </div>

              <div
                onClick={onOpenChart}
                className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer bg-slate-50 dark:bg-slate-900 shadow-inner"
              >
                <img
                  src="/retinal-thickness-longitudinal-chart.png"
                  alt="תרשים מעקב כרונולוגי של עובי הרשתית"
                  className="w-full h-32 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold backdrop-blur-[1px]">
                  <ZoomIn className="w-4 h-4" />
                  <span>לחץ להגדלת התרשים המלא</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-0.5">
                <span>תנודות: <strong>245µm ➔ 565µm</strong></span>
                <button
                  onClick={onOpenChart}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 flex items-center gap-1"
                >
                  <span>פתח תרשים מלא</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Chronological OCT Tracking Table (Section 5) */}
            {medicalData.octTimeline && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-sm overflow-hidden space-y-2">
                <div
                  onClick={() => setIsTableExpanded(!isTableExpanded)}
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 cursor-pointer border-b border-slate-100 dark:border-slate-700/60 select-none hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-500" />
                    <div>
                      <h3 className="text-xs font-black text-slate-900 dark:text-white">
                        מעקב כרונולוגי רב-שנתי (בדיקות OCT 2021–2026)
                      </h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {medicalData.octTimeline ? medicalData.octTimeline.length : 13} נקודות זמן: עין ימין (ביקורת) מול עין שמאל (מטופלת)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full">
                      {medicalData.octTimeline.length} בדיקות
                    </span>
                    {isTableExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {isTableExpanded && (
                  <div className="overflow-x-auto max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 text-right">
                    <table className="w-full text-right text-xs border-collapse">
                      <thead className="bg-slate-100/90 dark:bg-slate-900/90 sticky top-0 z-10 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider backdrop-blur-sm">
                        <tr>
                          <th className="py-2 px-2.5">מועד הבדיקה</th>
                          <th className="py-2 px-2.5">עין ימין (ביקורת)</th>
                          <th className="py-2 px-2.5">עין שמאל (מטופלת)</th>
                          <th className="py-2 px-2.5">משמעות קלינית ואבני דרך</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                        {medicalData.octTimeline.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-2 px-2.5 whitespace-nowrap align-top font-bold text-slate-900 dark:text-white">
                              <div>{row.period}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{row.date}</div>
                            </td>
                            <td className="py-2 px-2.5 align-top text-emerald-700 dark:text-emerald-400">
                              <span className="font-extrabold block text-xs">{row.odThickness}</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block">
                                <GlossaryText text={row.od} />
                              </span>
                            </td>
                            <td className="py-2 px-2.5 align-top text-rose-700 dark:text-rose-400">
                              <span className="font-extrabold block text-xs">{row.osThickness}</span>
                              <span className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight block">
                                <GlossaryText text={row.os} />
                              </span>
                            </td>
                            <td className="py-2 px-2.5 align-top text-slate-700 dark:text-slate-300 text-[10px] leading-relaxed">
                              <GlossaryText text={row.significance} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Key Clinical Takeaways Card (Section 6) */}
            {medicalData.clinicalTakeaways && (
              <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 to-sky-50/50 dark:from-slate-800 dark:to-indigo-950/30 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950 dark:text-indigo-200">
                    <Lightbulb className="w-4 h-4 text-indigo-500" />
                    <span>תובנות ומסקנות אינטגרטיביות מהמעקב</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                    4 עקרונות
                  </span>
                </div>
                
                <div className="space-y-2">
                  {medicalData.clinicalTakeaways.map((takeaway) => (
                    <div key={takeaway.id} className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-900/80 border border-indigo-100 dark:border-slate-700/80 text-[11px] leading-relaxed">
                      <div className="font-extrabold text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">
                          {takeaway.number}
                        </span>
                        <span>{takeaway.title}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] pr-5">
                        <GlossaryText text={takeaway.content} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: Treatment Actions (Injection & Laser) */}
        {activeTab === 'treatments' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                1. הדמיית הזרקה תוך-עינית (Intravitreal Injection):
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                <GlossaryText text="מחט עדינה חודרת דרך ה-Pars Plana בלובן העין, משחררת תרופה לזגוגית, והבצקת נסוגה ומייבשת את נוזלי הרשתית." />
              </p>
              <button
                onClick={onTriggerInjection}
                disabled={isInjecting}
                className="w-full py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-sky-500/20 disabled:opacity-50 transition-all"
              >
                <Syringe className="w-4 h-4" />
                <span>{isInjecting ? 'ההזרקה מתבצעת...' : 'בצע הדמיית הזרקה וייבוש בצקת'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                2. הדמיית צריבה בלייזר (Argon Laser Photocoagulation):
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                <GlossaryText text="קרן לייזר ירוקה (532nm) חודרת דרך האישון ומבצעת צריבה ממוקדת באזורי הדלף ברשתית לעצירת ההפרשה." />
              </p>
              <button
                onClick={onTriggerLaser}
                disabled={isLasering}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20 disabled:opacity-50 transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isLasering ? 'קרן הלייזר מופעלת...' : 'הפעל קרן לייזר וחשיפת מוקדי צריבה'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Cataract & Combined Protocol Actions */}
        {activeTab === 'cataract' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  מצב עכירות העדשה (קטרקט):
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  cataractMode === 'cataract'
                    ? 'bg-amber-500 text-white'
                    : cataractMode === 'iol'
                    ? 'bg-sky-500 text-white'
                    : 'bg-emerald-500 text-white'
                }`}>
                  {cataractMode === 'cataract' ? 'עכור וצהבהב (NS+3)' : cataractMode === 'iol' ? 'עדשה מלאכותית (PCIOL)' : 'עדשה טבעית צלולה'}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  onClick={() => onSetCataractMode('normal')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all border text-center ${
                    cataractMode === 'normal'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  עדשה צלולה
                </button>
                <button
                  onClick={() => onSetCataractMode('cataract')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all border text-center ${
                    cataractMode === 'cataract'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  עכירות קטרקט
                </button>
                <button
                  onClick={onPerformCataractSurgery}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all border text-center ${
                    cataractMode === 'iol'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  ניתוח קטרקט
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Future & Untried Treatment Options (Accordion Layout) */}
        {activeTab === 'future-treatments' && (
          <div className="space-y-3.5">
            
            {/* Header Advisory Callout */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-sky-300 dark:border-sky-800/80 bg-sky-50/80 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 text-xs">
              <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">לתשומת לב המטופל: </span>
                <GlossaryText text={currentTabData.callout} />
              </div>
            </div>

            {/* Accordion Cards of Untried Treatments */}
            <div className="space-y-2.5">
              {currentTabData.treatmentsList && currentTabData.treatmentsList.map((treatment) => {
                const isExpanded = expandedTreatment === treatment.id;
                return (
                  <div
                    key={treatment.id}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'bg-white dark:bg-slate-800/90 border-sky-500 shadow-md ring-1 ring-sky-500/20'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleAccordion(treatment.id, treatment.targetFocus)}
                      className="w-full p-3.5 text-right flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {treatment.category.split('–')[0]}
                          </span>
                          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400">
                            {treatment.tag}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                          {treatment.name}
                        </h4>
                      </div>
                      <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-500">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Accordion Body */}
                    {isExpanded && (
                      <div className="px-3.5 pb-4 pt-1 border-t border-slate-100 dark:border-slate-700/60 space-y-2.5 text-xs text-slate-700 dark:text-slate-300 animate-fadeIn">
                        
                        <div>
                          <span className="font-extrabold text-sky-700 dark:text-sky-400 block mb-0.5">
                            🔬 מנגנון הפעולה:
                          </span>
                          <p className="leading-relaxed text-[11px] text-slate-600 dark:text-slate-300">
                            <GlossaryText text={treatment.mechanism} />
                          </p>
                        </div>

                        <div>
                          <span className="font-extrabold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                            ✨ יתרונות פוטנציאליים:
                          </span>
                          <p className="leading-relaxed text-[11px] text-slate-600 dark:text-slate-300">
                            <GlossaryText text={treatment.advantages} />
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                          <span className="font-extrabold text-amber-800 dark:text-amber-300 block mb-0.5">
                            ⚖️ שיקולים ומה לברר מול הרופא:
                          </span>
                          <p className="leading-relaxed text-[11px] text-amber-900 dark:text-amber-200">
                            <GlossaryText text={treatment.considerations} />
                          </p>
                        </div>

                        {treatment.questionsForDoctor && treatment.questionsForDoctor.length > 0 && (
                          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
                            <span className="font-extrabold text-indigo-800 dark:text-indigo-300 block mb-1">
                              💬 שאלות ממוקדות לרופא לגבי טיפול זה:
                            </span>
                            <ul className="space-y-1 text-[11px] text-indigo-950 dark:text-indigo-200">
                              {treatment.questionsForDoctor.map((q, qIdx) => (
                                <li key={qIdx} className="flex items-start gap-1 leading-snug">
                                  <span className="font-bold text-indigo-500 mt-0.5">•</span>
                                  <span><GlossaryText text={q} /></span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Checklist of 4 Key Questions for the Upcoming Retinal Specialist Visit */}
            {currentTabData.checklistQuestions && (
              <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-slate-800 dark:to-indigo-950/40 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-extrabold text-xs">
                    <Stethoscope className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>צ'ק-ליסט שאלות ממוקד לפגישת המעקב הקרובה:</span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                    4 שאלות
                  </span>
                </div>
                <div className="space-y-2">
                  {currentTabData.checklistQuestions.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-900/80 border border-indigo-100 dark:border-slate-700/80 text-[11px] leading-relaxed">
                      <div className="font-extrabold text-indigo-900 dark:text-indigo-300 mb-0.5 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">
                          {item.number}
                        </span>
                        <span>{item.topic}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] pr-5">
                        <GlossaryText text={item.question} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 6: Dedicated Medical Glossary View */}
        {activeTab === 'glossary' && (
          <GlossaryView onSelectPart={onSelectPart} />
        )}

        {/* Clinical Metrics Grid (for Tabs 1 to 4) */}
        {currentTabData.metrics && (
          <div className="grid grid-cols-3 gap-2 pt-2">
            {currentTabData.metrics.map((m, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 text-center">
                <div className="text-[10px] text-slate-400 font-semibold mb-0.5 truncate">{m.label}</div>
                <div className={`text-xs font-extrabold ${
                  m.tone === 'healthy' ? 'text-emerald-600 dark:text-emerald-400' :
                  m.tone === 'danger' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Medical Text Sections (for Tabs 1 to 4) */}
        {currentTabData.sections && (
          <div className="space-y-3 pt-2">
            {currentTabData.sections.map((sec, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  {sec.heading}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <GlossaryText text={sec.content} />
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

    </aside>
  );
}
