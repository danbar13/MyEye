import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GLOSSARY_TERMS, CATEGORIES } from '../data/glossary';
import {
  Search,
  BookOpen,
  X,
  Filter,
  Sparkles,
  HelpCircle,
  Stethoscope,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';

export default function GlossaryView({ initialSelectedTermId, onSelectPart }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [highlightedTermId, setHighlightedTermId] = useState(initialSelectedTermId || null);
  const termRefs = useRef({});

  // Listen for custom navigation event from inline popovers
  useEffect(() => {
    const handleOpenGlossaryEvent = (e) => {
      if (e.detail && e.detail.termId) {
        setHighlightedTermId(e.detail.termId);
        setSearchQuery('');
        setSelectedCategory('all');
      }
    };
    window.addEventListener('myeye-open-glossary', handleOpenGlossaryEvent);
    return () => window.removeEventListener('myeye-open-glossary', handleOpenGlossaryEvent);
  }, []);

  // Scroll to highlighted term if set
  useEffect(() => {
    if (highlightedTermId && termRefs.current[highlightedTermId]) {
      const el = termRefs.current[highlightedTermId];
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Clear highlight animation after a few seconds
      const timer = setTimeout(() => {
        setHighlightedTermId(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [highlightedTermId]);

  // Filter and sort terms alphabetically by Hebrew term name
  const filteredTerms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = GLOSSARY_TERMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        (item.englishTerm && item.englishTerm.toLowerCase().includes(q)) ||
        item.aliases.some(a => a.toLowerCase().includes(q)) ||
        item.simpleDefinition.toLowerCase().includes(q) ||
        item.clinicalSignificance.toLowerCase().includes(q)
      );
    });

    // Sort alphabetically by Hebrew term
    return matches.sort((a, b) => a.term.localeCompare(b.term, 'he'));
  }, [searchQuery, selectedCategory]);

  // Group terms by first Hebrew letter
  const groupedTerms = useMemo(() => {
    const groups = {};
    filteredTerms.forEach((term) => {
      // Clean non-Hebrew prefix if any, get first character
      const cleanTerm = term.term.replace(/^["'״׳]/, '').trim();
      const firstLetter = cleanTerm.charAt(0) || '#';
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const sortedLetters = useMemo(() => {
    return Object.keys(groupedTerms).sort((a, b) => a.localeCompare(b, 'he'));
  }, [groupedTerms]);

  return (
    <div className="space-y-3.5 select-text">
      
      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-sky-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="חפש מונח רפואי (למשל: BRVO, בצקת, לייזר, OCT, פוביאה)..."
          className="w-full pr-10 pl-9 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="נקה חיפוש"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-sky-600 border-sky-600 text-white shadow-sm shadow-sky-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
        <span>
          נמצאו <strong>{filteredTerms.length}</strong> מונחים רפואיים
          {searchQuery && ` עבור "${searchQuery}"`}
        </span>
        <span className="flex items-center gap-1 font-mono">
          <ArrowUpDown className="w-3 h-3 text-sky-500" />
          סדר אלפביתי (א'–ת')
        </span>
      </div>

      {/* Empty State */}
      {filteredTerms.length === 0 && (
        <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            לא נמצא מונח תואם לחיפוש
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            נסה לחפש בלועזית או במונח כללי יותר (כגון "עין", "לחץ", "זריקה", "רשתית").
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline pt-1 inline-block"
          >
            איפוס החיפוש והצגת כל המונחים
          </button>
        </div>
      )}

      {/* Alphabetically Grouped Terms */}
      <div className="space-y-4">
        {sortedLetters.map((letter) => (
          <div key={letter} className="space-y-2">
            
            {/* Hebrew Letter Header Badge */}
            <div className="sticky top-0 z-10 flex items-center gap-2 py-1 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
              <span className="w-6 h-6 rounded-md bg-sky-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
                {letter}
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                ({groupedTerms[letter].length} מונחים)
              </span>
              <div className="flex-1 h-px bg-slate-200 dark:border-slate-800"></div>
            </div>

            {/* Term Cards for this Letter */}
            <div className="space-y-2.5">
              {groupedTerms[letter].map((term) => {
                const isTarget = highlightedTermId === term.id;

                return (
                  <div
                    key={term.id}
                    ref={(el) => (termRefs.current[term.id] = el)}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-300 shadow-sm ${
                      isTarget
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 ring-2 ring-sky-400/40 shadow-md'
                        : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 hover:border-sky-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {/* Card Header: Title + Category Pill + English Name */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {term.categoryHebrew}
                          </span>
                          {term.englishTerm && (
                            <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400" dir="ltr">
                              {term.englishTerm}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                          {term.term}
                        </h3>
                      </div>
                    </div>

                    {/* Simple Everyday Hebrew Definition */}
                    <div className="mb-2.5">
                      <span className="text-[11px] font-black text-sky-700 dark:text-sky-300 block mb-0.5 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>הסבר פשוט:</span>
                      </span>
                      <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                        {term.simpleDefinition}
                      </p>
                    </div>

                    {/* Clinical Importance / What it means for the patient */}
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
                      <span className="text-[11px] font-black text-amber-800 dark:text-amber-400 block mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>⚕️ למה זה חשוב עבורך?</span>
                      </span>
                      <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        {term.clinicalSignificance}
                      </p>
                    </div>

                    {/* Aliases & Abbreviations */}
                    {term.aliases && term.aliases.length > 1 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 flex-wrap text-[10px] text-slate-400">
                        <span>מופיע בטקסטים גם כ:</span>
                        {term.aliases.map((a, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
