import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Layers, Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// Layer offsets along the horizontal optical axis (X) when Exploded View is active
export const EXPLODE_OFFSETS = {
  // 1. Cornea (furthest left along optical axis)
  Cornea: [-3.20, 0, 0],

  // 2. Iris & Pupil
  Iris_Pupil: [-2.10, 0, 0],

  // 3. Lens & Zonules
  Lens: [-1.05, 0, 0],
  Zonules: [-1.05, 0, 0],

  // 4. Vitreous body
  Vitreous: [0.0, 0, 0],

  // 5. Sclera outer shell + Ciliary Body + Sclera Vessels + Muscles
  Sclera: [1.15, 0, 0],
  Sclera_Vessels: [1.15, 0, 0],
  Ciliary_Body: [1.15, 0, 0],
  Eye_Muscles: [1.15, 0, 0],

  // 6. Choroid vascular middle cup + Choroid Vessels
  Choroid: [2.35, 0, 0],
  Choroid_Vessels: [2.35, 0, 0],

  // 7. Retina inner cup + Vessels + Macula + Optic Disc + Treatments
  Retina: [3.65, 0, 0],
  Retina_Vessels: [3.65, 0, 0],
  Macula: [3.65, 0, 0],
  Optic_Disc: [3.65, 0, 0],
  Edema_Swelling: [3.65, 0, 0],
  Laser_Spots: [3.65, 0, 0],

  // 8. Optic Nerve stalk (separated to the right of retina)
  Optic_Nerve: [4.85, 0, 0],
  Optic_Nerve_Artery: [4.85, 0, 0],
  Optic_Nerve_Vein: [4.85, 0, 0]
};

// Exploded view 8 primary layers with clean alternating positions (Y = ±1.35)
const EXPLODED_LAYER_LABELS = [
  { id: 'Cornea', label: 'קרנית', pos: [-3.20, -1.35, 0.20] },
  { id: 'Iris_Pupil', label: 'אישון וקשתית', pos: [-2.10, 1.35, 0.20] },
  { id: 'Lens', label: 'העדשה', pos: [-1.05, -1.35, 0.20] },
  { id: 'Vitreous', label: 'זגוגית העין', pos: [0.0, 1.35, 0.20] },
  { id: 'Sclera', label: 'לובן העין', pos: [1.15, -1.35, 0.20] },
  { id: 'Choroid', label: 'הדמית', pos: [2.35, 1.35, 0.20] },
  { id: 'Retina', label: 'הרשתית', pos: [3.65, -1.35, 0.20] },
  { id: 'Optic_Nerve', label: 'עצב הראייה', pos: [4.85, 1.35, 0.20] }
];

// 3D Callout with 6px anchor dot, crisp 1px pointer line, and offset compact badge
function CalloutBadge({
  position,
  lineOffset = { x: -70, y: 50 },
  dotColor = 'bg-rose-500',
  dotRingColor = 'ring-white/90',
  pingDot = false,
  badgeClass = 'bg-rose-600 text-white border-rose-400',
  label,
  isSelected = false,
  onClick,
  onPointerOver,
  onPointerOut
}) {
  const { x: dx, y: dy } = lineOffset;
  const isLeft = dx < 0;
  const isTop = dy < 0;

  const svgWidth = Math.max(1, Math.abs(dx));
  const svgHeight = Math.max(1, Math.abs(dy));
  const svgLeft = isLeft ? dx : 0;
  const svgTop = isTop ? dy : 0;

  const startX = isLeft ? svgWidth : 0;
  const startY = isTop ? svgHeight : 0;
  const endX = isLeft ? 0 : svgWidth;
  const endY = isTop ? 0 : svgHeight;

  return (
    <Html position={position} center={false} zIndexRange={[100, 0]}>
      <div
        className="relative select-none pointer-events-auto"
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        {/* 1. Small 6px Anchor Dot on the Exact Anatomical Point */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2 left-0 top-0 z-30 cursor-pointer group">
          <div className={`w-1.5 h-1.5 rounded-full shadow-md transition-transform duration-200 group-hover:scale-150 ${dotColor} ring-2 ${dotRingColor}`}>
            {pingDot && (
              <span className={`absolute -inset-1 rounded-full ${dotColor} opacity-75 animate-ping`} />
            )}
          </div>
        </div>

        {/* 2. Crisp 1px Pointer Line */}
        <svg
          style={{
            position: 'absolute',
            left: `${svgLeft}px`,
            top: `${svgTop}px`,
            width: `${svgWidth}px`,
            height: `${svgHeight}px`,
            pointerEvents: 'none',
            overflow: 'visible'
          }}
        >
          {/* Subtle dark underlay line for high contrast */}
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="rgba(0, 0, 0, 0.45)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Crisp foreground pointer line */}
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="rgba(255, 255, 255, 0.95)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>

        {/* 3. Offset Compact Text Badge */}
        <div
          style={{
            position: 'absolute',
            left: `${dx}px`,
            top: `${dy}px`,
            transform: isLeft ? 'translate(-100%, -50%)' : 'translate(0%, -50%)'
          }}
          className="z-20 cursor-pointer pointer-events-auto"
        >
          <div
            className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-black whitespace-nowrap shadow-lg border backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${badgeClass} ${
              isSelected ? 'ring-2 ring-white scale-105 shadow-xl' : ''
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
            <span>{label}</span>
          </div>
        </div>
      </div>
    </Html>
  );
}

// 3D Model loader and controller inside canvas
function EyeModel({
  activeTab,
  selectedPart,
  onSelectPart,
  isSwollen,
  octThickness = 565,
  isInjecting,
  isLasering,
  showLaserSpots,
  cataractMode,
  isExploded,
  showLabels = true
}) {
  const { scene } = useGLTF('/models/human_eye.glb');
  const groupRef = useRef();
  const [hoveredPart, setHoveredPart] = useState(null);

  // Map and configure all meshes (cleaning _mesh and _curve suffixes from Blender glTF export)
  const objectsMap = useMemo(() => {
    const map = {};
    scene.traverse((child) => {
      if (child.isMesh) {
        const cleanName = child.name.replace(/(_mesh|_curve).*$/, '');
        map[cleanName] = child;
        map[child.name] = child;
        child.castShadow = true;
        child.receiveShadow = true;

        // Clone material so instances don't share conflicting properties
        if (child.material) {
          child.material = child.material.clone();

          // Sclera: Clean, matte off-white anatomical finish
          if (cleanName === 'Sclera') {
            child.material.color.setRGB(0.97, 0.96, 0.95);
            child.material.roughness = 0.70;
            child.material.metalness = 0.0;
          }

          // Ciliary_Body: Deep reddish-brown ciliary muscle / pars plana band
          if (cleanName === 'Ciliary_Body') {
            child.material.color.setRGB(0.49, 0.13, 0.12);
            child.material.roughness = 0.60;
          }

          // Sclera_Vessels: Fine red episcleral blood vessels on outer white shell
          if (cleanName === 'Sclera_Vessels') {
            child.material.color.setRGB(0.77, 0.19, 0.19);
            child.material.emissive.setHex(0x550a0a);
            child.material.emissiveIntensity = 0.25;
          }

          // Cornea: Crystal clear glossy convex dome
          if (cleanName === 'Cornea') {
            child.material.transparent = true;
            child.material.opacity = 0.28;
            child.material.roughness = 0.04;
            child.material.color.setRGB(0.92, 0.97, 1.0);
          }

          // Iris_Pupil: Detailed blue-green radial texture preserved from Blender
          if (cleanName === 'Iris_Pupil') {
            child.material.roughness = 0.40;
          }

          // Lens: Natural crystal-clear crystalline lens by default
          if (cleanName === 'Lens') {
            child.material.transparent = true;
            child.material.opacity = 0.18;
            child.material.roughness = 0.03;
            child.material.depthWrite = false;
            child.material.color.setRGB(0.96, 0.98, 1.0);
          }

          // Zonules: Delicate suspensory ligament ring
          if (cleanName === 'Zonules') {
            child.material.transparent = true;
            child.material.opacity = 0.35;
            child.material.roughness = 0.30;
            child.material.depthWrite = false;
            child.material.color.setRGB(0.95, 0.98, 1.0);
          }

          // Vitreous: Translucent spherical gel body that does NOT occlude interior
          if (cleanName === 'Vitreous') {
            child.material.transparent = true;
            child.material.opacity = 0.08;
            child.material.depthWrite = false;
            child.material.roughness = 0.10;
            child.material.color.setRGB(0.94, 0.98, 1.0);
          }

          // Choroid: Dark reddish-brown vascular middle cup (#5A1818)
          if (cleanName === 'Choroid') {
            child.material.color.setRGB(0.35, 0.09, 0.09);
            child.material.roughness = 0.65;
          }

          // Choroid_Vessels: Dark burgundy choroidal vascular network
          if (cleanName === 'Choroid_Vessels') {
            child.material.color.setRGB(0.22, 0.04, 0.04);
            child.material.roughness = 0.50;
          }

          // Retina: Warm golden-orange inner cup (#E08A3C)
          if (cleanName === 'Retina') {
            child.material.color.setRGB(0.88, 0.54, 0.24);
            child.material.roughness = 0.50;
          }

          // Optic_Disc: Pale yellowish oval exit zone
          if (cleanName === 'Optic_Disc') {
            child.material.color.setRGB(0.99, 0.95, 0.78);
            child.material.roughness = 0.55;
          }

          // Macula: Distinct darker amber focal spot in center-back
          if (cleanName === 'Macula') {
            child.material.color.setRGB(0.52, 0.30, 0.05);
            child.material.roughness = 0.65;
          }

          // Edema_Swelling: Cystic fluid accumulation dome over macula
          if (cleanName === 'Edema_Swelling') {
            child.material.transparent = true;
            child.material.opacity = 0.75;
            child.material.color.setRGB(0.96, 0.25, 0.37);
            child.material.emissive.setHex(0xe11d48);
            child.material.emissiveIntensity = 0.5;
            child.material.roughness = 0.2;
            child.material.depthWrite = false;
          }

          // Retina_Vessels: High-contrast arterial and venous branches hugging retina
          if (cleanName === 'Retina_Vessels') {
            child.material.color.setRGB(0.86, 0.15, 0.15);
            child.material.emissive.setHex(0x550a0a);
            child.material.emissiveIntensity = 0.35;
          }

          // Eye_Muscles: Striated reddish-pink muscle bands
          if (cleanName === 'Eye_Muscles') {
            child.material.color.setRGB(0.77, 0.19, 0.19);
            child.material.roughness = 0.55;
          }

          // Optic_Nerve: Creamy anatomical nerve cord sheath
          if (cleanName === 'Optic_Nerve') {
            child.material.color.setRGB(0.95, 0.91, 0.86);
            child.material.roughness = 0.60;
          }

          // Optic_Nerve_Artery: Central retinal artery (red core)
          if (cleanName === 'Optic_Nerve_Artery') {
            child.material.color.setRGB(0.86, 0.15, 0.15);
            child.material.emissive.setHex(0x550a0a);
            child.material.emissiveIntensity = 0.40;
          }

          // Optic_Nerve_Vein: Central retinal vein (blue core)
          if (cleanName === 'Optic_Nerve_Vein') {
            child.material.color.setRGB(0.11, 0.31, 0.85);
            child.material.emissive.setHex(0x0a1e55);
            child.material.emissiveIntensity = 0.35;
          }
        }
      }
    });
    return map;
  }, [scene]);

  // Ensure Laser_Spots mesh from glTF is parented directly inside Retina so it always moves with Retina
  useEffect(() => {
    const retinaMesh = objectsMap['Retina'];
    const laserSpotsMesh = objectsMap['Laser_Spots'];
    if (retinaMesh && laserSpotsMesh && laserSpotsMesh.parent !== retinaMesh) {
      retinaMesh.add(laserSpotsMesh);
      laserSpotsMesh.position.set(0, 0, 0);
    }
  }, [objectsMap]);

  // Animation frame loop: Highlights, Exploded view slide, & Edema Shape Key
  useFrame((_, delta) => {
    const alpha = Math.min(1.0, Math.max(0.0, delta * 5));

    // 1. Animate layer offsets for exploded view along optical axis X
    Object.entries(objectsMap).forEach(([name, mesh]) => {
      if (name.includes('_mesh') || name.includes('_curve')) return;
      // If Laser_Spots is parented to Retina, it automatically inherits Retina's offset
      if (name === 'Laser_Spots' && mesh.parent === objectsMap['Retina']) return;

      const targetOffset = isExploded && EXPLODE_OFFSETS[name] ? EXPLODE_OFFSETS[name] : [0, 0, 0];
      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targetOffset[0], alpha);
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetOffset[1], alpha);
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetOffset[2], alpha);

      // Highlight selected or hovered mesh with clean medical sky-blue glow
      if (mesh.material) {
        const isSelected = selectedPart === name || (selectedPart === 'Fovea' && name === 'Macula');
        const isHovered = hoveredPart === name;

        if (mesh.material.emissive) {
          if (isSelected) {
            mesh.material.emissive.setHex(0x0284c7);
            mesh.material.emissiveIntensity = 0.55;
          } else if (isHovered) {
            mesh.material.emissive.setHex(0x38bdf8);
            mesh.material.emissiveIntensity = 0.35;
          } else if (name !== 'Retina_Vessels' && name !== 'Sclera_Vessels' && name !== 'Optic_Nerve_Artery' && name !== 'Optic_Nerve_Vein') {
            mesh.material.emissive.setHex(0x000000);
            mesh.material.emissiveIntensity = 0;
          }
        }
      }
    });

    // 2. Edema Shape Key Animation (Smooth cyst fluid accumulation)
    const edemaMesh = objectsMap['Edema_Swelling'];
    if (edemaMesh && edemaMesh.morphTargetInfluences && edemaMesh.morphTargetInfluences.length > 0) {
      const progress = Math.max(0.0, Math.min(1.0, (octThickness - 240) / (565 - 240)));
      const targetWeight = isSwollen ? Math.max(0.08, progress) : 0.0;
      const current = edemaMesh.morphTargetInfluences[0] ?? 0;
      edemaMesh.morphTargetInfluences[0] = THREE.MathUtils.lerp(current, targetWeight, Math.min(1.0, delta * 4));
    }
  });

  // Cataract Material Update on Lens
  useEffect(() => {
    const lensMesh = objectsMap['Lens'];
    if (lensMesh && lensMesh.material) {
      const mat = lensMesh.material;
      if (activeTab === 'cataract' && cataractMode === 'cataract') {
        mat.color.setRGB(0.85, 0.52, 0.12); // Amber cloudy nuclear sclerosis (NS+3)
        mat.roughness = 0.65;
        mat.opacity = 0.88;
        mat.depthWrite = true;
        mat.transparent = true;
      } else if (activeTab === 'cataract' && cataractMode === 'iol') {
        mat.color.setRGB(0.88, 0.96, 1.0); // Pristine clear artificial intraocular lens (PCIOL)
        mat.roughness = 0.02;
        mat.opacity = 0.22;
        mat.depthWrite = false;
        mat.transparent = true;
      } else {
        // Natural crystal-clear crystalline lens
        mat.color.setRGB(0.96, 0.98, 1.0);
        mat.roughness = 0.03;
        mat.opacity = 0.18;
        mat.depthWrite = false;
        mat.transparent = true;
      }
      mat.needsUpdate = true;
    }
  }, [cataractMode, activeTab, objectsMap]);

  // Laser spots visibility
  useEffect(() => {
    const laserSpots = objectsMap['Laser_Spots'];
    if (laserSpots) {
      laserSpots.visible = showLaserSpots || isLasering;
      if (laserSpots.material) {
        laserSpots.material.color.setRGB(0.99, 0.94, 0.54);
        laserSpots.material.emissive.setHex(isLasering ? 0x84cc16 : 0xca8a04);
        laserSpots.material.emissiveIntensity = isLasering ? 0.9 : 0.35;
      }
    }
  }, [showLaserSpots, isLasering, objectsMap]);

  // Standard anatomical hotspots for overview tabs
  const standardHotspots = useMemo(() => [
    { id: 'Cornea', label: 'קרנית', basePos: [-1.02, -0.25, 0.22] },
    { id: 'Iris_Pupil', label: 'אישון וקשתית', basePos: [-0.72, -0.32, 0.20] },
    { id: 'Lens', label: 'העדשה', basePos: [-0.58, -0.15, 0.10] },
    { id: 'Vitreous', label: 'הגוף הזגוגי', basePos: [0.0, -0.15, -0.15] },
    { id: 'Sclera', label: 'לובן העין (Pars Plana)', basePos: [-0.20, -0.85, 0.35] },
    { id: 'Choroid', label: 'הדמית', basePos: [-0.15, -0.85, -0.25] },
    { id: 'Retina', label: 'הרשתית', basePos: [0.45, 0.35, -0.55] },
    { id: 'Macula', label: 'המקולה', basePos: [0.85, -0.22, -0.22] },
    { id: 'Optic_Nerve', label: 'עצב הראייה', basePos: [1.35, -0.08, -0.15] }
  ], []);

  return (
    <group ref={groupRef}>
      {/* 3D Eyeball Model with Mesh Interactivity */}
      <primitive
        object={scene}
        onClick={(e) => {
          e.stopPropagation();
          if (e.object && e.object.name) {
            let cleanName = e.object.name.replace(/(_mesh|_curve).*$/, '');
            if (cleanName === 'Optic_Nerve_Artery' || cleanName === 'Optic_Nerve_Vein') cleanName = 'Optic_Nerve';
            if (cleanName === 'Sclera_Vessels' || cleanName === 'Ciliary_Body') cleanName = 'Sclera';
            if (cleanName === 'Choroid_Vessels') cleanName = 'Choroid';
            if (cleanName === 'Zonules') cleanName = 'Lens';
            if (cleanName === 'Optic_Disc') cleanName = 'Retina';
            onSelectPart(cleanName);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (e.object && e.object.name) {
            let cleanName = e.object.name.replace(/(_mesh|_curve).*$/, '');
            if (cleanName === 'Optic_Nerve_Artery' || cleanName === 'Optic_Nerve_Vein') cleanName = 'Optic_Nerve';
            if (cleanName === 'Sclera_Vessels' || cleanName === 'Ciliary_Body') cleanName = 'Sclera';
            if (cleanName === 'Choroid_Vessels') cleanName = 'Choroid';
            if (cleanName === 'Zonules') cleanName = 'Lens';
            if (cleanName === 'Optic_Disc') cleanName = 'Retina';
            setHoveredPart(cleanName);
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => {
          setHoveredPart(null);
          document.body.style.cursor = 'auto';
        }}
      />

      {/* 3D Floating Labels & Clinical Annotations (Controlled by showLabels toggle) */}
      {showLabels && (
        isExploded ? (
          /* Exploded View: Clean, spaced-out single-word layer labels with alternating top/bottom positions */
          EXPLODED_LAYER_LABELS.map((item) => {
            const isSelected = selectedPart === item.id;
            const isHovered = hoveredPart === item.id;
            const isTreatmentActive = isInjecting || isLasering;
            const isRelevantLayer = item.id === 'Vitreous' || item.id === 'Retina';

            // Auto-hide non-relevant layer badges during active treatment playback in Exploded View
            if (isTreatmentActive && !isRelevantLayer) {
              return null;
            }

            return (
              <Html key={item.id} position={item.pos} center zIndexRange={[100, 0]}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPart(isSelected ? null : item.id);
                  }}
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    setHoveredPart(item.id);
                  }}
                  onPointerOut={() => setHoveredPart(null)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black shadow-md border backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap ${
                    isTreatmentActive && isRelevantLayer
                      ? 'bg-slate-900/80 text-white/90 border-sky-400/60 opacity-75 scale-95'
                      : isSelected
                      ? 'bg-sky-600 text-white border-sky-300 ring-2 ring-white scale-110 shadow-sky-500/50'
                      : isHovered
                      ? 'bg-slate-800 text-white border-sky-400 scale-105 shadow-md'
                      : 'bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:border-sky-400'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-sky-500'}`} />
                  <span>{item.label}</span>
                </button>
              </Html>
            );
          })
        ) : activeTab === 'retina-issue' ? (
          /* Tab 2: Pathology Callout Badges with Offset Pointer Lines (Never covering the swelling cyst!) */
          <>
            {/* 1. Macula / Edema Swelling: 6px Dot at center, text pill offset downward-left into empty margin */}
            <CalloutBadge
              position={[0.85, -0.22, -0.22]}
              lineOffset={{ x: -65, y: 50 }}
              label={octThickness <= 280 ? `המקולה (מצב תקין - ${octThickness}µm)` : `המקולה (בצקת פעילה - ${octThickness}µm)`}
              dotColor={octThickness <= 280 ? 'bg-emerald-500' : 'bg-rose-500'}
              dotRingColor={octThickness <= 280 ? 'ring-emerald-300' : 'ring-rose-300'}
              pingDot={octThickness > 280}
              badgeClass={octThickness <= 280 ? 'bg-emerald-600/95 text-white border-emerald-400 shadow-emerald-500/40' : 'bg-rose-600/95 text-white border-rose-400 shadow-rose-500/40'}
              isSelected={selectedPart === 'Macula' || selectedPart === 'Fovea'}
              onClick={() => onSelectPart(selectedPart === 'Macula' ? null : 'Macula')}
              onPointerOver={() => setHoveredPart('Macula')}
              onPointerOut={() => setHoveredPart(null)}
            />

            {/* 2. BRVO Leaking Vessel Branch: Dot on upper vessel branch, text pill offset upward-left */}
            <CalloutBadge
              position={[0.72, 0.02, -0.28]}
              lineOffset={{ x: -65, y: -45 }}
              label="סעיף ורידי (BRVO) ודלף"
              dotColor="bg-amber-500"
              dotRingColor="ring-amber-300"
              badgeClass="bg-amber-600/95 text-white border-amber-400 shadow-amber-500/40"
              isSelected={selectedPart === 'Retina_Vessels'}
              onClick={() => onSelectPart(selectedPart === 'Retina_Vessels' ? null : 'Retina_Vessels')}
              onPointerOver={() => setHoveredPart('Retina_Vessels')}
              onPointerOut={() => setHoveredPart(null)}
            />

            {/* 3. Optic Nerve / Optic Disc: Dot on posterior optic disc opening, text pill offset outward-right */}
            <CalloutBadge
              position={[1.12, -0.16, -0.10]}
              lineOffset={{ x: 50, y: -30 }}
              label="עצב הראייה (דיסק אופטי)"
              dotColor="bg-sky-500"
              dotRingColor="ring-sky-300"
              badgeClass="bg-sky-600/95 text-white border-sky-400 shadow-sky-500/40"
              isSelected={selectedPart === 'Optic_Nerve'}
              onClick={() => onSelectPart(selectedPart === 'Optic_Nerve' ? null : 'Optic_Nerve')}
              onPointerOver={() => setHoveredPart('Optic_Nerve')}
              onPointerOut={() => setHoveredPart(null)}
            />
          </>
        ) : (
          /* Other Tabs: Clean interactive hotspots on relevant anatomical structures */
          standardHotspots.map((h) => {
            const isSelected = selectedPart === h.id || (selectedPart === 'Fovea' && h.id === 'Macula');
            const isHovered = hoveredPart === h.id;
            const showBadge = isSelected || isHovered;

            return (
              <Html key={h.id} position={h.basePos} center zIndexRange={[100, 0]}>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPart(isSelected ? null : h.id);
                  }}
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    setHoveredPart(h.id);
                  }}
                  onPointerOut={() => setHoveredPart(null)}
                  className="cursor-pointer group relative flex flex-col items-center justify-center select-none"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-150 shadow-md ${
                      isSelected
                        ? 'bg-sky-400 ring-2 ring-white scale-125'
                        : 'bg-sky-500 ring-1 ring-white/90 hover:bg-sky-400'
                    }`}
                  />
                  {showBadge && (
                    <div className="mt-1 px-2 py-0.5 rounded-lg text-[11px] font-black whitespace-nowrap bg-slate-900/95 text-white border border-sky-400 shadow-md pointer-events-none">
                      {h.label}
                    </div>
                  )}
                </div>
              </Html>
            );
          })
        )
      )}

      {/* Animated Intravitreal Injection Needle (Live Vitreous mesh tracking via getWorldPosition) */}
      {isInjecting && <InjectionNeedle vitreousMesh={objectsMap['Vitreous']} />}

      {/* Animated 532nm Green Laser Beam (Live Cornea to live Retina tracking) */}
      {isLasering && (
        <GreenLaserBeam
          corneaMesh={objectsMap['Cornea']}
          retinaMesh={objectsMap['Retina']}
        />
      )}

      {/* Cluster of delicate photocoagulation burn spots on retina (Live Retina tracking) */}
      {(showLaserSpots || isLasering) && (
        <LaserBurnSpots
          retinaMesh={objectsMap['Retina']}
          isLasering={isLasering}
        />
      )}

      {/* 3D Dynamic Cystoid Macular Edema (CME) Swelling Dome (Live Retina tracking) */}
      <CystoidEdemaMesh
        retinaMesh={objectsMap['Retina']}
        isSwollen={isSwollen}
        octThickness={octThickness}
        activeTab={activeTab}
      />

      {/* 3D Superotemporal BRVO Vascular Occlusion Site & Hemorrhagic Leakage (Live Retina tracking) */}
      {activeTab === 'retina-issue' && (
        <BrvoLeakageVessels
          retinaMesh={objectsMap['Retina']}
          isSwollen={isSwollen}
          octThickness={octThickness}
          activeTab={activeTab}
        />
      )}
    </group>
  );
}

// 3D Injection Needle Animation Component - Pars Plana Anatomical Entry
function InjectionNeedle({ vitreousMesh }) {
  const needleGroupRef = useRef();
  const dropletRef = useRef();
  const progressRef = useRef(0);

  useFrame((_, delta) => {
    progressRef.current += delta;
    const t = progressRef.current; // Total animation duration ~3.0s

    // Calculate live world center of vitreous
    const vCenter = new THREE.Vector3();
    if (vitreousMesh) {
      vitreousMesh.getWorldPosition(vCenter);
    }

    // Pars Plana entry and target inside vitreous cavity relative to live Vitreous center
    const pEntry = new THREE.Vector3(vCenter.x - 0.35, vCenter.y + 0.98, vCenter.z + 0.18);
    const pVitreous = new THREE.Vector3(vCenter.x + 0.02, vCenter.y + 0.12, vCenter.z - 0.04);

    const dirVec = new THREE.Vector3().subVectors(pVitreous, pEntry).normalize();
    const orientationQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), dirVec);
    const retractedPos = pEntry.clone().addScaledVector(dirVec, -0.45);

    // 1. Needle insertion & retraction motion along dirVec
    if (needleGroupRef.current) {
      const currentTipPos = new THREE.Vector3();

      if (t < 0.65) {
        const p = Math.sin((t / 0.65) * Math.PI * 0.5);
        currentTipPos.lerpVectors(retractedPos, pVitreous, p);
      } else if (t < 1.4) {
        currentTipPos.copy(pVitreous);
      } else if (t < 2.3) {
        const p = Math.sin(((t - 1.4) / 0.9) * Math.PI * 0.5);
        currentTipPos.lerpVectors(pVitreous, retractedPos, p);
      } else {
        currentTipPos.copy(retractedPos);
      }

      needleGroupRef.current.position.copy(currentTipPos);
      needleGroupRef.current.quaternion.copy(orientationQuat);
    }

    // 2. Glowing medication droplet formation & gentle dispersion INSIDE the Vitreous sphere
    if (dropletRef.current) {
      if (t < 0.65) {
        dropletRef.current.scale.set(0, 0, 0);
        dropletRef.current.position.copy(pVitreous);
      } else if (t < 1.3) {
        const p = Math.min(1.0, (t - 0.65) / 0.65);
        const s = p * (1.0 + Math.sin(t * 12) * 0.12);
        dropletRef.current.scale.set(s, s, s);
        dropletRef.current.position.copy(pVitreous);
        if (dropletRef.current.material) {
          dropletRef.current.material.opacity = 0.85;
        }
      } else if (t < 2.9) {
        const p = Math.min(1.0, (t - 1.3) / 1.6);
        // Slowly expands and diffuses inside the Vitreous cavity
        const s = 1.0 + p * 1.4;
        dropletRef.current.scale.set(s, s, s);
        // Gentle slow drift inside the vitreous body
        dropletRef.current.position.set(
          pVitreous.x + p * 0.08,
          pVitreous.y - p * 0.05,
          pVitreous.z - p * 0.06
        );
        if (dropletRef.current.material) {
          dropletRef.current.material.opacity = Math.max(0.0, 0.85 * (1.0 - p * 0.9));
        }
      } else {
        dropletRef.current.scale.set(0, 0, 0);
      }
    }
  });

  return (
    <group>
      {/* Intravitreal Syringe Assembly (Cannula, Hub, Barrel & Plunger) */}
      <group ref={needleGroupRef}>
        <mesh position={[0, 0.50, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.0, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.08} />
        </mesh>
        <mesh position={[0, 1.06, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.14, 16]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.88} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.48, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.70, 16]} />
          <meshStandardMaterial color="#e0f2fe" transparent opacity={0.65} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.70, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.25, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.2} roughness={0.3} />
        </mesh>
      </group>

      {/* Glowing Medication Droplet Dispersing in Vitreous */}
      <mesh ref={dropletRef} scale={[0, 0, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.2}
          transparent
          opacity={0.85}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// 3D Focused 532nm Green Laser Beam dynamically spanning from Cornea to Retina
function GreenLaserBeam({ corneaMesh, retinaMesh }) {
  const beamGroupRef = useRef();
  const laserMeshRef = useRef();
  const glowMeshRef = useRef();
  const sparkRef = useRef();

  useFrame(({ clock }) => {
    const corneaPos = new THREE.Vector3();
    const retinaPos = new THREE.Vector3();

    if (corneaMesh) corneaMesh.getWorldPosition(corneaPos);
    if (retinaMesh) retinaMesh.getWorldPosition(retinaPos);

    // Front corneal entry point
    const startPos = new THREE.Vector3(corneaPos.x - 0.25, corneaPos.y + 0.18, corneaPos.z + 0.18);
    // Spot on the inner macular/retinal surface (relative offset to retinal burn center)
    const targetPos = new THREE.Vector3(retinaPos.x + 0.50, retinaPos.y - 0.35, retinaPos.z - 0.42);

    const beamLen = Math.max(0.1, startPos.distanceTo(targetPos));
    const midPoint = new THREE.Vector3().addVectors(startPos, targetPos).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(targetPos, startPos).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

    if (beamGroupRef.current) {
      beamGroupRef.current.position.copy(midPoint);
      beamGroupRef.current.quaternion.copy(q);
    }

    if (laserMeshRef.current) {
      const pulse = 1.0 + Math.sin(clock.getElapsedTime() * 35) * 0.15;
      laserMeshRef.current.scale.set(pulse, beamLen, pulse);
    }

    if (glowMeshRef.current) {
      glowMeshRef.current.scale.set(1, beamLen, 1);
    }

    if (sparkRef.current) {
      const s = 1.0 + Math.sin(clock.getElapsedTime() * 45) * 0.25;
      sparkRef.current.position.copy(targetPos);
      sparkRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Laser Beam Cylinder spanning dynamically from Cornea to Retina */}
      <group ref={beamGroupRef}>
        <mesh ref={laserMeshRef}>
          <cylinderGeometry args={[0.007, 0.005, 1.0, 16]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <mesh ref={glowMeshRef}>
          <cylinderGeometry args={[0.018, 0.012, 1.0, 16]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      </group>

      {/* Retinal Strike Point Flash & Thermal Glow Spark */}
      <mesh ref={sparkRef}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshBasicMaterial color="#bbf7d0" />
      </mesh>
    </group>
  );
}

// Cluster of small, delicate photocoagulation burn spots on targeted retina
function LaserBurnSpots({ retinaMesh, isLasering }) {
  const groupRef = useRef();
  const spots = useMemo(() => [
    [0.74, -0.35, -0.42], // Primary strike center
    [0.78, -0.32, -0.38],
    [0.76, -0.38, -0.40],
    [0.71, -0.34, -0.46],
    [0.68, -0.39, -0.49],
    [0.65, -0.33, -0.52],
    [0.62, -0.37, -0.55]
  ], []);

  useFrame(() => {
    if (groupRef.current && retinaMesh) {
      groupRef.current.position.set(retinaMesh.position.x, retinaMesh.position.y, retinaMesh.position.z);
    }
  });

  return (
    <group ref={groupRef}>
      {spots.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh>
            <sphereGeometry args={[0.020, 12, 12]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive={isLasering ? "#84cc16" : "#ca8a04"}
              emissiveIntensity={isLasering ? 1.0 : 0.4}
              roughness={0.3}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.028, 12, 12]} />
            <meshBasicMaterial color="#65a30d" transparent opacity={0.45} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 3D Dynamic Cystoid Macular Edema (CME) Swelling Simulation over the Macula
function CystoidEdemaMesh({ retinaMesh, isSwollen, octThickness = 565, activeTab }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const innerCystsRef = useRef();
  const currentScaleRef = useRef(isSwollen ? 1 : 0);

  // Position of Macula on the posterior retina
  const basePos = useMemo(() => new THREE.Vector3(0.85, -0.22, -0.22), []);
  // Inward normal vector pointing from retinal wall into vitreous cavity
  const inwardNormal = useMemo(() => new THREE.Vector3(-0.85, 0.22, 0.22).normalize(), []);
  
  // Orientation quaternion to orient dome along the inward normal
  const orientationQuat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), inwardNormal);
    return q;
  }, [inwardNormal]);

  // Normalized thickness progress: 0.0 at 240µm, 1.0 at 565µm
  const progress = Math.max(0.0, Math.min(1.0, (octThickness - 240) / (565 - 240)));

  useFrame(({ clock }, delta) => {
    // Dynamic position lock to retinaMesh
    if (groupRef.current && retinaMesh) {
      groupRef.current.position.set(
        basePos.x + retinaMesh.position.x,
        basePos.y + retinaMesh.position.y,
        basePos.z + retinaMesh.position.z
      );
    }

    // When isSwollen is true, scale is dictated by slider progress (min 0.08 so it's always distinct when active)
    const targetScale = isSwollen ? Math.max(0.08, progress) : 0.0;
    currentScaleRef.current = THREE.MathUtils.lerp(
      currentScaleRef.current,
      targetScale,
      Math.min(1.0, delta * 4.5)
    );

    const s = currentScaleRef.current;
    if (meshRef.current) {
      if (s > 0.01) {
        meshRef.current.visible = true;
        // Subtle organic fluid shimmer
        const pulse = isSwollen ? 1.0 + Math.sin(clock.getElapsedTime() * 3.0) * 0.025 : 1.0;
        // Visual thickness: at 565µm, dome extends prominently forward (height factor 1.85)
        meshRef.current.scale.set(s * pulse * 1.15, s * pulse * 1.85, s * pulse * 1.15);
      } else {
        meshRef.current.visible = false;
      }
    }

    if (innerCystsRef.current) {
      if (s > 0.04) {
        innerCystsRef.current.visible = true;
        const pulseCysts = 1.0 + Math.sin(clock.getElapsedTime() * 4.0) * 0.04;
        innerCystsRef.current.scale.set(s * pulseCysts, s * pulseCysts * 1.70, s * pulseCysts);
      } else {
        innerCystsRef.current.visible = false;
      }
    }
  });

  return (
    <group ref={groupRef} position={[basePos.x, basePos.y, basePos.z]} quaternion={orientationQuat}>
      {/* Outer Cystic Fluid Swelling Dome (Translucent glowing fluid accumulation) */}
      <mesh ref={meshRef} position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.16, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#f43f5e"
          emissive="#e11d48"
          emissiveIntensity={isSwollen ? 0.75 : 0.15}
          roughness={0.12}
          metalness={0.1}
          transparent
          opacity={0.84}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Internal Honeycomb Petaloid Fluid Micro-Cysts (OPL/INL fluid spaces) */}
      <group ref={innerCystsRef} position={[0, 0.035, 0]}>
        {[
          [0.0, 0.045, 0.0, 0.052],    // Central foveal cyst
          [0.065, 0.025, 0.04, 0.036],  // 6 radial surrounding petaloid cysts
          [-0.065, 0.025, -0.04, 0.036],
          [0.04, 0.025, -0.065, 0.036],
          [-0.04, 0.025, 0.065, 0.036],
          [0.07, 0.02, -0.02, 0.032],
          [-0.07, 0.02, 0.02, 0.032]
        ].map((cyst, idx) => (
          <mesh key={idx} position={[cyst[0], cyst[1], cyst[2]]}>
            <sphereGeometry args={[cyst[3], 14, 14]} />
            <meshStandardMaterial
              color="#fb7185"
              emissive="#fda4af"
              emissiveIntensity={0.88}
              transparent
              opacity={0.90}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// 3D Superotemporal BRVO Arteriovenous Occlusion Site & Hemorrhagic Leakage Micro-dots
function BrvoLeakageVessels({ retinaMesh, isSwollen, octThickness = 565, activeTab }) {
  const groupRef = useRef();
  const leakageGlowRef = useRef();

  // Normalized leakage factor
  const progress = Math.max(0.0, Math.min(1.0, (octThickness - 240) / (565 - 240)));

  // Superotemporal vessel branch location on upper retina
  const basePos = useMemo(() => new THREE.Vector3(0.74, -0.04, -0.32), []);

  // Leakage micro-dots along the tributary branch toward the macula
  const microDots = useMemo(() => [
    [0.0, 0.0, 0.0, 0.022],         // Occlusion AV crossing
    [0.02, -0.02, 0.015, 0.014],
    [0.04, -0.04, 0.03, 0.016],
    [0.06, -0.06, 0.045, 0.018],
    [0.08, -0.08, 0.06, 0.020],     // Radiating toward macula
    [-0.02, 0.015, -0.02, 0.013],
    [0.035, -0.015, 0.01, 0.012],
    [0.055, -0.035, 0.025, 0.014]
  ], []);

  useFrame(({ clock }) => {
    if (groupRef.current && retinaMesh) {
      groupRef.current.position.set(
        basePos.x + retinaMesh.position.x,
        basePos.y + retinaMesh.position.y,
        basePos.z + retinaMesh.position.z
      );
    }

    if (leakageGlowRef.current) {
      const p = isSwollen ? progress : 0;
      leakageGlowRef.current.visible = p > 0.05;
      if (p > 0.05) {
        const pulse = 1.0 + Math.sin(clock.getElapsedTime() * 3.2) * 0.08;
        leakageGlowRef.current.scale.set(p * pulse, p * pulse, p * pulse);
      }
    }
  });

  return (
    <group ref={groupRef} position={[basePos.x, basePos.y, basePos.z]}>
      {/* Occlusion Site Beacon (AV Crossing) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.026, 14, 14]} />
        <meshStandardMaterial
          color="#ea580c"
          emissive="#f97316"
          emissiveIntensity={isSwollen ? 1.0 : 0.25}
          roughness={0.2}
        />
      </mesh>

      {/* Leaking Micro-Aneurysms & Intraretinal Hemorrhage Flame Micro-dots */}
      {microDots.map((dot, idx) => (
        <mesh key={idx} position={[dot[0], dot[1], dot[2]]}>
          <sphereGeometry args={[dot[3], 10, 10]} />
          <meshStandardMaterial
            color="#dc2626"
            emissive="#b91c1c"
            emissiveIntensity={isSwollen ? 0.85 : 0.15}
            roughness={0.3}
            transparent
            opacity={isSwollen ? 0.92 : 0.3}
          />
        </mesh>
      ))}

      {/* Diffuse Hyperfluorescent Vascular Leakage Cloud */}
      <mesh ref={leakageGlowRef} position={[0.04, -0.04, 0.03]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial
          color="#f43f5e"
          transparent
          opacity={0.30}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Camera transition controller - Profile Cutaway 3D View (Perfect horizontal centering & Tab 2 close-up)
function CameraController({
  activeTab,
  selectedPart,
  resetTrigger,
  isExploded,
  onRegisterControls,
  onZoomChange
}) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const isAnimatingRef = useRef(false);
  const animStartTimeRef = useRef(0);
  const startPosRef = useRef(new THREE.Vector3());
  const startTargetRef = useRef(new THREE.Vector3());
  const lastReportedZoomRef = useRef(100);

  // Target camera positions
  const targetConfig = useMemo(() => {
    // If exploded view is active, step back to panoramic view centered across all separated layers
    if (isExploded) {
      return {
        pos: new THREE.Vector3(0.85, 0.40, 8.8),
        target: new THREE.Vector3(0.85, 0.0, 0.0)
      };
    }

    // Tab 2 (Retina Issue / CME Swelling / Macula Focus): Direct view looking inside the concave retinal cutaway cavity
    if (selectedPart === 'Macula' || selectedPart === 'Fovea' || selectedPart === 'Edema_Swelling' || activeTab === 'retina-issue') {
      return {
        pos: new THREE.Vector3(-0.45, 0.55, 1.85),
        target: new THREE.Vector3(0.55, -0.15, -0.15)
      };
    }

    // Tab 4 (Cataract & Lens Replacement): Focus on Lens & Anterior Chamber, eyeball centered
    if (selectedPart === 'Lens' || activeTab === 'cataract') {
      return {
        pos: new THREE.Vector3(-1.10, 0.40, 2.70),
        target: new THREE.Vector3(0.10, 0.0, 0.0)
      };
    }

    // Tab 3 (Treatments: Pars Plana Injections & Laser Photocoagulation): Clear cutaway overview, eyeball centered
    if (activeTab === 'treatments') {
      return {
        pos: new THREE.Vector3(-0.65, 0.60, 2.85),
        target: new THREE.Vector3(0.10, 0.0, 0.0)
      };
    }

    // Tab 5 (Future Treatments)
    if (activeTab === 'future-treatments') {
      if (selectedPart === 'Vitreous') {
        return {
          pos: new THREE.Vector3(-0.45, 0.50, 2.75),
          target: new THREE.Vector3(0.10, 0.0, 0.0)
        };
      }
      return {
        pos: new THREE.Vector3(-0.35, 0.35, 2.65),
        target: new THREE.Vector3(0.12, -0.05, 0.0)
      };
    }

    // Default: Clear 3/4 Isometric Front-Side Cutaway Angle, eyeball dead-center
    return {
      pos: new THREE.Vector3(-0.85, 0.55, 2.80),
      target: new THREE.Vector3(0.10, 0.0, 0.0)
    };
  }, [activeTab, selectedPart, resetTrigger, isExploded]);

  // Base distance for the target configuration (used for 100% reference)
  const baseDistance = useMemo(() => {
    return targetConfig.pos.distanceTo(targetConfig.target);
  }, [targetConfig]);

  // When targetConfig changes, start smooth animation to new vantage point
  useEffect(() => {
    isAnimatingRef.current = true;
    animStartTimeRef.current = performance.now();
    startPosRef.current.copy(camera.position);
    if (controlsRef.current) {
      startTargetRef.current.copy(controlsRef.current.target);
    }
  }, [targetConfig, camera]);

  // Halt scripted animation as soon as user begins interacting with OrbitControls (drag, wheel, touch)
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleUserStart = () => {
      isAnimatingRef.current = false;
    };

    controls.addEventListener('start', handleUserStart);
    return () => {
      controls.removeEventListener('start', handleUserStart);
    };
  }, []);

  // Expose zoom actions to parent
  useEffect(() => {
    if (onRegisterControls) {
      onRegisterControls({
        zoomIn: () => {
          isAnimatingRef.current = false;
          if (!controlsRef.current) return;
          const target = controlsRef.current.target;
          const offset = camera.position.clone().sub(target);
          const curDist = offset.length();
          const newDist = Math.max(controlsRef.current.minDistance, curDist * 0.80);
          offset.setLength(newDist);
          camera.position.copy(target).add(offset);
          controlsRef.current.update();
        },
        zoomOut: () => {
          isAnimatingRef.current = false;
          if (!controlsRef.current) return;
          const target = controlsRef.current.target;
          const offset = camera.position.clone().sub(target);
          const curDist = offset.length();
          const newDist = Math.min(controlsRef.current.maxDistance, curDist * 1.25);
          offset.setLength(newDist);
          camera.position.copy(target).add(offset);
          controlsRef.current.update();
        },
        resetZoom: () => {
          isAnimatingRef.current = true;
          animStartTimeRef.current = performance.now();
          startPosRef.current.copy(camera.position);
          if (controlsRef.current) {
            startTargetRef.current.copy(controlsRef.current.target);
          }
        }
      });
    }
  }, [camera, onRegisterControls, targetConfig]);

  useFrame(() => {
    if (!controlsRef.current) return;

    if (isAnimatingRef.current) {
      const elapsed = (performance.now() - animStartTimeRef.current) / 1000;
      const duration = 0.75;
      const progress = Math.min(1.0, elapsed / duration);
      // Smooth cubic ease-out curve
      const ease = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startPosRef.current, targetConfig.pos, ease);
      controlsRef.current.target.lerpVectors(startTargetRef.current, targetConfig.target, ease);
      controlsRef.current.update();

      if (progress >= 1.0) {
        isAnimatingRef.current = false;
      }
    }

    // Monitor zoom percentage
    const curDist = camera.position.distanceTo(controlsRef.current.target);
    const calculatedPct = Math.round((baseDistance / curDist) * 100);
    if (Math.abs(calculatedPct - lastReportedZoomRef.current) >= 2) {
      lastReportedZoomRef.current = calculatedPct;
      if (onZoomChange) {
        onZoomChange(calculatedPct);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={0.8}
      maxDistance={14}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
    />
  );
}

export default function EyeCanvas({
  activeTab,
  selectedPart,
  onSelectPart,
  isSwollen,
  octThickness = 565,
  isInjecting,
  isLasering,
  showLaserSpots,
  cataractMode,
  resetTrigger,
  isExploded,
  onToggleExploded
}) {
  const [showLabels, setShowLabels] = useState(true);
  const [zoomPercent, setZoomPercent] = useState(100);
  const zoomActionsRef = useRef(null);

  const handleZoomIn = (e) => {
    e.stopPropagation();
    if (zoomActionsRef.current?.zoomIn) {
      zoomActionsRef.current.zoomIn();
    }
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    if (zoomActionsRef.current?.zoomOut) {
      zoomActionsRef.current.zoomOut();
    }
  };

  const handleResetZoom = (e) => {
    e.stopPropagation();
    if (zoomActionsRef.current?.resetZoom) {
      zoomActionsRef.current.resetZoom();
    }
  };

  return (
    <div className="w-full h-full relative outline-none select-none">
      {/* Floating Top-Left Zoom Controls Toolbar (Matches Tab 1 style and controls) */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
        <button
          onClick={handleZoomIn}
          disabled={zoomPercent >= 300}
          className="p-1.5 sm:p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="הגדל תצוגה (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          className="px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
          title="אפס גודל (100%)"
        >
          {zoomPercent}%
        </button>
        <button
          onClick={handleZoomOut}
          disabled={zoomPercent <= 35}
          className="p-1.5 sm:p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="הקטן תצוגה (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        {Math.abs(zoomPercent - 100) > 8 && (
          <button
            onClick={handleResetZoom}
            className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="איפוס מבט"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Top Action Toolbar (Layers Explode & Labels Visibility) */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
        {/* Toggle Labels Visibility Button */}
        <button
          onClick={() => setShowLabels(prev => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-md backdrop-blur-md border ${
            showLabels
              ? 'bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-sky-400'
              : 'bg-slate-200/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600'
          }`}
          title={showLabels ? "הסתר תוויות צפות" : "הצג תוויות צפות"}
        >
          {showLabels ? <Eye className="w-4 h-4 text-sky-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          <span>{showLabels ? 'הסתר תוויות' : 'הצג תוויות'}</span>
        </button>

        {/* Toggle Exploded View Button (Available during structural inspection, hidden in Tab 3 treatments) */}
        {activeTab !== 'treatments' && (
          <button
            onClick={onToggleExploded}
            disabled={isInjecting || isLasering}
            className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-md backdrop-blur-md border ${
              isExploded
                ? 'bg-sky-600 text-white border-sky-400 shadow-sky-500/40 scale-105'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-sky-400'
            } disabled:opacity-50 disabled:pointer-events-none`}
            title="פרק את העין לשכבות נפרדות לאורך ציר האופטיקה או הרכב חזרה"
          >
            <Layers className="w-4 h-4" />
            <span>{isExploded ? 'הרכב עין חזרה' : 'פרק עין לשכבות'}</span>
          </button>
        )}
      </div>

      <Canvas
        camera={{ position: [-1.15, 0.75, 2.85], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Soft Medical Studio Lighting */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 6, 6]} intensity={1.5} />
        <directionalLight position={[-6, 3, 4]} intensity={1.2} color="#e0f2fe" />
        <directionalLight position={[0, -4, 4]} intensity={0.7} color="#fed7aa" />
        <pointLight position={[0, 0, 2.5]} intensity={0.6} />

        {/* 3D Eyeball Model & Clinical Animations */}
        <EyeModel
          activeTab={activeTab}
          selectedPart={selectedPart}
          onSelectPart={onSelectPart}
          isSwollen={isSwollen}
          octThickness={octThickness}
          isInjecting={isInjecting}
          isLasering={isLasering}
          showLaserSpots={showLaserSpots}
          cataractMode={cataractMode}
          isExploded={isExploded}
          showLabels={showLabels}
        />

        {/* Dynamic Camera Controller with User Interaction & Toolbar Zoom Support */}
        <CameraController
          activeTab={activeTab}
          selectedPart={selectedPart}
          resetTrigger={resetTrigger}
          isExploded={isExploded}
          onRegisterControls={(actions) => {
            zoomActionsRef.current = actions;
          }}
          onZoomChange={(pct) => {
            setZoomPercent(pct);
          }}
        />
      </Canvas>

      {/* Floating Canvas Navigation Hint */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 pointer-events-none bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 shadow-sm max-w-[85vw] truncate">
        <span>{isExploded ? '🔍 שכבות מופרדות לאורך הציר האופטי | לחץ על שכבה לפרטים' : '🖱️ הדמיית תלת-ממד | מבט 3/4 בחתך אנטומי (גרור לסיבוב / גלול לזום)'}</span>
      </div>
    </div>
  );
}
