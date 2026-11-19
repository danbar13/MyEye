import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { GLOSSARY_TERMS } from '../data/glossary';
import { X, HelpCircle, BookOpen, ExternalLink, Sparkles } from 'lucide-react';

// Pre-process and sort glossary aliases by descending length so longer phrases match first
const COMPILED_ALIASES = (() => {
  const list = [];
  GLOSSARY_TERMS.forEach((term) => {
    // Add primary term
    list.push({ text: term.term, term });
    // Add aliases
    term.aliases.forEach((alias) => {
      if (!list.some(item => item.text.toLowerCase() === alias.toLowerCase())) {
        list.push({ text: alias, term });
      }
    });
  });
  // Sort longest first to prioritize exact matches over shorter substrings
  return list.sort((a, b) => b.text.length - a.text.length);
})();

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Build regex pattern matching aliases: Latin acronyms get word boundaries (\b) to avoid partial sub-matches
const GLOSSARY_REGEX = new RegExp(
  `(${COMPILED_ALIASES.map(item => {
    const escaped = escapeRegex(item.text);
    if (/^[A-Za-z0-9\-_]+$/.test(item.text)) {
      return `\\b${escaped}\\b`;
    }
    return escaped;
  }).join('|')})`,
  'gi'
);

/**
 * Floating Popover Bubble rendered into document.body with smart viewport positioning
 */
function GlossaryPopover({ term, anchorRect, onClose, onOpenFullGlossary }) {
  const popoverRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 340, arrowSide: 'top' });

  useEffect(() => {
    if (!anchorRect) return;

    const popoverWidth = Math.min(360, window.innerWidth - 24);
    const estimatedHeight = 250;

    // Calculate vertical position (prefer below, flip above if close to bottom)
    const spaceBelow = window.innerHeight - anchorRect.bottom;
    const spaceAbove = anchorRect.top;
    let top = 0;
    let arrowSide = 'top';

    if (spaceBelow >= estimatedHeight || spaceBelow > spaceAbove) {
      top = anchorRect.bottom + 8;
      arrowSide = 'top';
    } else {
      top = Math.max(12, anchorRect.top - estimatedHeight - 8);
      arrowSide = 'bottom';
    }

    // Calculate horizontal center aligned with anchor
    const anchorCenter = anchorRect.left + anchorRect.width / 2;
    let left = anchorCenter - popoverWidth / 2;

    // Clamp within viewport boundaries
    const minLeft = 12;
    const maxLeft = window.innerWidth - popoverWidth - 12;
    left = Math.max(minLeft, Math.min(maxLeft, left));

    setCoords({ top, left, width: popoverWidth, arrowSide });
  }, [anchorRect]);

  // Click outside and escape key handling
  useEffect(() => {
    let mountedAt = Date.now();

    const handleClickOutside = (e) => {
      // Ignore click if it just opened within 150ms
      if (Date.now() - mountedAt < 150) return;
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!term || !anchorRect) return null;

  return createPortal(
    <div
      ref={popoverRef}
      dir="rtl"
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: `${coords.width}px`,
        zIndex: 99999
      }}
      className="bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-700/80 rounded-2xl shadow-2xl p-4 text-slate-800 dark:text-slate-100 animate-fadeIn backdrop-blur-md select-text"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300">
              {term.categoryHebrew}
            </span>
            {term.englishTerm && (
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[200px]" dir="ltr">
                {term.englishTerm}
              </span>
            )}
          </div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
            {term.term}
          </h4>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="סגור חלונית הסבר"
          aria-label="סגור"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Simple Layman Explanation */}
      <div className="space-y-2.5 text-xs">
        <div>
          <span className="text-[11px] font-black text-sky-700 dark:text-sky-400 block mb-0.5 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>הסבר פשוט ובגובה העיניים:</span>
          </span>
          <p className="text-[11.5px] leading-relaxed text-slate-700 dark:text-slate-300">
            {term.simpleDefinition}
          </p>
        </div>

        {/* Clinical Relevance */}
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-800/80 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-900/60">
          <span className="text-[11px] font-black text-amber-800 dark:text-amber-300 block mb-0.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>למה זה חשוב עבורך?</span>
          </span>
          <p className="text-[11px] leading-relaxed text-slate-700 dark:text-amber-100/90">
            {term.clinicalSignificance}
          </p>
        </div>
      </div>

      {/* Footer with link to full glossary */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          מילון מונחים אינטראקטיבי
        </span>
        <button
          onClick={() => {
            onClose();
            if (onOpenFullGlossary) {
              onOpenFullGlossary(term.id);
            } else {
              window.dispatchEvent(new CustomEvent('myeye-open-glossary', { detail: { termId: term.id } }));
            }
          }}
          className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 transition-colors group"
        >
          <span>הצג במילון המונחים המלא</span>
          <BookOpen className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>,
    document.body
  );
}

/**
 * GlossaryText component: Parses text, highlights matching medical terms inline,
 * and attaches click popover trigger.
 */
export default function GlossaryText({ text, className = '' }) {
  const [activePopover, setActivePopover] = useState(null); // { term, rect }

  if (!text || typeof text !== 'string') {
    return <span className={className}>{text}</span>;
  }

  // Split string into text segments and matches
  const parts = useMemo(() => {
    // Reset regex index
    GLOSSARY_REGEX.lastIndex = 0;
    const tokens = [];
    let lastIndex = 0;
    let match;

    while ((match = GLOSSARY_REGEX.exec(text)) !== null) {
      const matchStart = match.index;
      const matchEnd = GLOSSARY_REGEX.lastIndex;
      const matchedString = match[0];

      // Push preceding text if any
      if (matchStart > lastIndex) {
        tokens.push({
          type: 'text',
          content: text.slice(lastIndex, matchStart),
          key: `text-${lastIndex}`
        });
      }

      // Find matching term definition
      const normalizedMatch = matchedString.toLowerCase();
      const matchedEntry = COMPILED_ALIASES.find(
        item => item.text.toLowerCase() === normalizedMatch
      );

      if (matchedEntry) {
        tokens.push({
          type: 'term',
          content: matchedString,
          term: matchedEntry.term,
          key: `term-${matchStart}-${matchedString}`
        });
      } else {
        tokens.push({
          type: 'text',
          content: matchedString,
          key: `text-${matchStart}`
        });
      }

      lastIndex = matchEnd;
    }

    // Push remaining text if any
    if (lastIndex < text.length) {
      tokens.push({
        type: 'text',
        content: text.slice(lastIndex),
        key: `text-${lastIndex}`
      });
    }

    return tokens;
  }, [text]);

  const handleTermClick = (e, term) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setActivePopover({ term, rect });
  };

  return (
    <span className={`glossary-text-wrapper ${className}`}>
      {parts.map((part) => {
        if (part.type === 'text') {
          return <React.Fragment key={part.key}>{part.content}</React.Fragment>;
        }

        const isHighlighted = activePopover?.term?.id === part.term.id;

        return (
          <span
            key={part.key}
            onClick={(e) => handleTermClick(e, part.term)}
            className={`inline-block cursor-help border-b-2 border-dotted border-sky-400 dark:border-sky-500 text-sky-700 dark:text-sky-300 font-medium px-0.5 rounded-sm transition-all duration-150 hover:bg-sky-100/70 dark:hover:bg-sky-950/70 hover:text-sky-900 dark:hover:text-white ${
              isHighlighted ? 'bg-sky-200/80 dark:bg-sky-900/80 font-bold' : ''
            }`}
            title={`לחץ להסבר פשוט על: ${part.term.term}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTermClick(e, part.term);
              }
            }}
          >
            {part.content}
          </span>
        );
      })}

      {/* Floating Popover Portal */}
      {activePopover && (
        <GlossaryPopover
          term={activePopover.term}
          anchorRect={activePopover.rect}
          onClose={() => setActivePopover(null)}
        />
      )}
    </span>
  );
}
