import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import EyeCanvas from './components/EyeCanvas';
import AnatomyImageViewer from './components/AnatomyImageViewer';
import NavigationPanel from './components/NavigationPanel';
import ChartModal from './components/ChartModal';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('anatomy');
  const [selectedPart, setSelectedPart] = useState(null);
  const [isSwollen, setIsSwollen] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [isLasering, setIsLasering] = useState(false);
  const [showLaserSpots, setShowLaserSpots] = useState(false);
  const [cataractMode, setCataractMode] = useState('normal'); // 'normal', 'cataract', 'iol'
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [octThickness, setOctThickness] = useState(565); // Real-time macular thickness (240µm - 565µm)

  // Responsive desktop detection for flexible split-pane vs mobile layout
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // OCT Longitudinal Chart Modal State
  const [isChartOpen, setIsChartOpen] = useState(false);

  // Split-Pane Resizing State (25% to 75% range, default 38%)
  const [panelWidthPercent, setPanelWidthPercent] = useState(38);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const splitContainerRef = useRef(null);

  // Sync dark class on root html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Jump to glossary tab when requested from inline term popovers
  useEffect(() => {
    const handleOpenGlossary = () => {
      setActiveTab('glossary');
    };
    window.addEventListener('myeye-open-glossary', handleOpenGlossary);
    return () => window.removeEventListener('myeye-open-glossary', handleOpenGlossary);
  }, []);

  // Tab change handler
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedPart(null);
    setIsExploded(false); // Force assembled eye state across clinical tabs

    // Keep lens clear by default across all tabs unless cataract is explicitly activated
    if (tabId !== 'cataract') {
      setCataractMode('normal');
    }

    if (tabId === 'retina-issue') {
      setIsSwollen(true);
      setOctThickness(565);
    } else if (tabId === 'future-treatments') {
      setSelectedPart('Macula');
    }
  };

  // Change OCT thickness via slider
  const handleSetOctThickness = (val) => {
    const num = Math.round(val);
    setOctThickness(num);
    setIsSwollen(num > 280);
  };

  // 2-state segmented toggle ('healthy' vs 'swollen')
  const handleToggleEdemaMode = (mode) => {
    if (mode === 'healthy') {
      setOctThickness(240);
      setIsSwollen(false);
    } else {
      setOctThickness(565);
      setIsSwollen(true);
    }
  };

  // Trigger Intravitreal Injection Animation & Edema Resolution
  const handleTriggerInjection = () => {
    if (isInjecting) return;
    setIsExploded(false); // Automatically re-assemble eye for anatomically accurate treatment
    setIsInjecting(true);

    setTimeout(() => {
      setIsSwollen(false);
      setOctThickness(240);
    }, 1200);

    setTimeout(() => {
      setIsInjecting(false);
    }, 3000);
  };

  // Trigger Laser Photocoagulation Animation & Reveal Burn Spots
  const handleTriggerLaser = () => {
    if (isLasering) return;
    setIsExploded(false); // Automatically re-assemble eye for anatomically accurate treatment
    setIsLasering(true);

    setTimeout(() => {
      setShowLaserSpots(true);
      setIsLasering(false);
    }, 2800);
  };

  // Perform Cataract Surgery
  const handlePerformCataractSurgery = () => {
    setCataractMode('iol');
  };

  // Reset Camera View
  const handleResetCamera = () => {
    setSelectedPart(null);
    setResetTrigger((prev) => prev + 1);
  };

  // Handle Start Dragging (Mouse & Touch)
  const handleStartDrag = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // Split-Pane Drag Listeners (RTL-aware: Right = Text Panel, Left = Visual Canvas)
  useEffect(() => {
    const handleMove = (e) => {
      if (!isDraggingRef.current || !splitContainerRef.current) return;
      
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      if (clientX === null) return;

      const rect = splitContainerRef.current.getBoundingClientRect();
      const totalWidth = rect.width;
      if (totalWidth <= 0) return;

      // In RTL layout with the text panel on the RIGHT:
      // The text panel extends from cursor clientX to rect.right:
      const panelWidthPx = rect.right - clientX;
      let newPercent = (panelWidthPx / totalWidth) * 100;

      // Allow resizing from 25% to 75% for each side
      newPercent = Math.max(25, Math.min(75, newPercent));
      setPanelWidthPercent(newPercent);
    };

    const handleStopDrag = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleStopDrag);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleStopDrag);
    window.addEventListener('touchcancel', handleStopDrag);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleStopDrag);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleStopDrag);
      window.removeEventListener('touchcancel', handleStopDrag);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans">
      
      {/* Top Application Header */}
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onResetCamera={handleResetCamera}
        onOpenChart={() => setIsChartOpen(true)}
      />

      {/* Main Responsive Split Layout:
          In RTL Desktop (md:flex-row):
            1. Right (order-1): Learning & Navigation Text Panel
            2. Center (order-2): Resizable Splitter Divider
            3. Left (order-3): Visual Viewer (2D Anatomy / 3D Canvas)
          In Mobile (flex-col):
            1. Top (order-1): Visual Viewer
            2. Bottom (order-2): Learning & Navigation Text Panel
      */}
      <div
        ref={splitContainerRef}
        className="flex-1 flex flex-col md:flex-row overflow-hidden relative select-none w-full"
      >
        
        {/* 1. Learning & Navigation Text Panel (RIGHT side in RTL Desktop) */}
        <section
          style={isDesktop ? { width: `${panelWidthPercent}%` } : undefined}
          className="w-full md:w-auto flex-1 md:flex-initial md:h-full min-h-0 z-10 relative overflow-hidden transition-none flex flex-col order-2 md:order-1"
        >
          <NavigationPanel
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedPart={selectedPart}
            onSelectPart={setSelectedPart}
            isSwollen={isSwollen}
            octThickness={octThickness}
            onSetOctThickness={handleSetOctThickness}
            onToggleEdemaMode={handleToggleEdemaMode}
            onToggleEdema={() => setIsSwollen(!isSwollen)}
            onTriggerInjection={handleTriggerInjection}
            isInjecting={isInjecting}
            onTriggerLaser={handleTriggerLaser}
            isLasering={isLasering}
            cataractMode={cataractMode}
            onSetCataractMode={setCataractMode}
            onPerformCataractSurgery={handlePerformCataractSurgery}
            onFocusTreatment={(focusPart) => setSelectedPart(focusPart)}
            onOpenChart={() => setIsChartOpen(true)}
          />

          {isDragging && <div className="absolute inset-0 z-50 cursor-col-resize pointer-events-auto" />}
        </section>

        {/* 2. Draggable Split-Screen Resizer Divider Handle (Middle, Desktop/Tablet) */}
        <div
          onMouseDown={handleStartDrag}
          onTouchStart={handleStartDrag}
          className={`hidden md:flex items-center justify-center w-3 -mx-1.5 cursor-col-resize z-40 select-none group relative bg-transparent touch-none md:order-2 ${
            isDragging ? 'bg-sky-500/15' : 'hover:bg-sky-500/10'
          }`}
          title="לחץ וגרור ימינה/שמאלה לשינוי גודל חלון הקריאה או תצוגת התלת-ממד (25% עד 75%)"
          role="separator"
          aria-orientation="vertical"
          aria-valuenow={panelWidthPercent}
          aria-valuemin={25}
          aria-valuemax={75}
        >
          {/* Vertical divider line and grip indicator */}
          <div className={`w-[3px] h-full transition-colors relative flex items-center justify-center ${
            isDragging ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-sky-400'
          }`}>
            <div className={`w-3.5 h-10 rounded-full border shadow-md flex items-center justify-center gap-0.5 pointer-events-none transition-all ${
              isDragging
                ? 'bg-sky-600 border-sky-400 shadow-sky-500/40 text-white scale-105'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 group-hover:border-sky-400'
            }`}>
              <span className={`w-0.5 h-4 rounded-full ${isDragging ? 'bg-white' : 'bg-slate-400 dark:bg-slate-500 group-hover:bg-sky-400'}`}></span>
              <span className={`w-0.5 h-4 rounded-full ${isDragging ? 'bg-white' : 'bg-slate-400 dark:bg-slate-500 group-hover:bg-sky-400'}`}></span>
            </div>
          </div>
        </div>

        {/* 3. Visual Viewer Area (LEFT side in RTL Desktop): 2D Interactive Diagram or 3D Eye Canvas */}
        <main
          style={isDesktop ? { width: `${100 - panelWidthPercent}%` } : undefined}
          className="w-full md:w-auto h-[44vh] sm:h-[48vh] md:h-full min-w-0 relative bg-slate-100/60 dark:bg-[#070a12] transition-none flex-shrink-0 md:flex-shrink md:flex-grow overflow-hidden flex items-center justify-center order-1 md:order-3"
        >
          {activeTab === 'anatomy' ? (
            <AnatomyImageViewer
              selectedPart={selectedPart}
              onSelectPart={setSelectedPart}
              isDark={isDark}
            />
          ) : (
            <EyeCanvas
              activeTab={activeTab}
              selectedPart={selectedPart}
              onSelectPart={setSelectedPart}
              isSwollen={isSwollen}
              octThickness={octThickness}
              isInjecting={isInjecting}
              isLasering={isLasering}
              showLaserSpots={showLaserSpots}
              cataractMode={cataractMode}
              resetTrigger={resetTrigger}
              isExploded={isExploded}
              onToggleExploded={() => setIsExploded(prev => !prev)}
            />
          )}

          {/* Mouse overlay during drag to prevent viewport from capturing pointer events */}
          {isDragging && <div className="absolute inset-0 z-50 cursor-col-resize pointer-events-auto" />}
        </main>

      </div>

      {/* Fullscreen High-Resolution OCT Longitudinal Chart Modal */}
      <ChartModal
        isOpen={isChartOpen}
        onClose={() => setIsChartOpen(false)}
      />

    </div>
  );
}
