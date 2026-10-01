/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { FishItem, PronounPerson, FloatingText, GameMode } from '../types/game';
import { FishSprite } from './FishSprite';
import { soundManager } from '../utils/sound';
import { speechManager } from '../utils/speech';
import { Volume2, Music, Maximize, Minimize, BookOpen, RotateCcw, Home } from 'lucide-react';

interface FishingOceanProps {
  gameMode: GameMode;
  fishes: FishItem[];
  selectedFish: FishItem | null;
  escapeTimeLeft?: number;
  floatingTexts: FloatingText[];
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onSelectFish: (fish: FishItem) => void;
  onDropToBasket: (person: PronounPerson) => void;
  onReturnHome?: () => void;
  onRestartGame?: () => void;
  onEndGame?: () => void;
  onOpenRules?: () => void;
}

export const FishingOcean: React.FC<FishingOceanProps> = ({
  gameMode,
  fishes,
  selectedFish,
  escapeTimeLeft = 3.0,
  floatingTexts,
  isFullscreen,
  onToggleFullscreen,
  onSelectFish,
  onDropToBasket,
  onReturnHome,
  onRestartGame,
  onEndGame,
  onOpenRules,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1000);
  const [hasInteractedAudio, setHasInteractedAudio] = useState(soundManager.isUnlocked);

  // Rod tip coordinates in percentage of the ocean container
  const ROD_TIP_X = 18;
  const ROD_TIP_Y = 14;

  // Track ocean container width for exact mouth pixel-to-percentage calculations
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleDragStart = (e: React.DragEvent, fish: FishItem) => {
    e.dataTransfer.setData('text/plain', fish.id);
    soundManager.unlock();
    speechManager.speakWord(fish.wordItem.word);
    setHasInteractedAudio(true);
    onSelectFish(fish);
  };

  const handleFishClick = (fish: FishItem) => {
    soundManager.unlock();
    speechManager.speakWord(fish.wordItem.word);
    setHasInteractedAudio(true);
    onSelectFish(fish);
  };

  const handleOceanClick = () => {
    soundManager.unlock();
    setHasInteractedAudio(true);
  };

  // EXACT FISH MOUTH POSITION:
  // Dynamically calculated using fish sprite dimensions and current container width
  let targetMouthX = ROD_TIP_X;
  let targetMouthY = 30;

  if (selectedFish) {
    const isFacingLeft = selectedFish.direction === 'left';
    const isMdScreen = typeof window !== 'undefined' && window.innerWidth >= 768;
    const isBigCreature = selectedFish.creatureType === 'whale' || selectedFish.creatureType === 'shark' || selectedFish.creatureType === 'dinosaur';
    const baseWidth = isBigCreature ? (isMdScreen ? 220 : 180) : (isMdScreen ? 176 : 144);
    const mouthPx = baseWidth * 0.46 * (selectedFish.scale || 1) * 1.05;
    const mouthPercent = containerWidth > 0 ? (mouthPx / containerWidth) * 100 : 7.5;

    targetMouthX = isFacingLeft ? selectedFish.x - mouthPercent : selectedFish.x + mouthPercent;
    targetMouthY = selectedFish.creatureType === 'dinosaur' ? selectedFish.y - 2.8 : selectedFish.y;
  }

  return (
    <div
      ref={containerRef}
      onClick={handleOceanClick}
      className="relative w-full flex-1 min-h-[520px] md:min-h-[600px] overflow-hidden select-none"
      style={{
        touchAction: 'manipulation',
        background: 'linear-gradient(180deg, #60a5fa 0%, #38bdf8 18%, #0284c7 40%, #0369a1 70%, #082f49 100%)',
      }}
    >
      {/* Floating Finish Game Button & Restart Button */}
      <div className="absolute top-3 left-3 z-40 flex items-center gap-2">
        {onReturnHome && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.unlock();
              onReturnHome();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-sky-200 border border-sky-400/30 text-xs font-bold backdrop-blur-md flex items-center gap-1.5 shadow-xl transition-all cursor-pointer active:scale-95"
            title="กลับสู่หน้าหลัก"
          >
            <Home className="w-3.5 h-3.5 text-sky-400" />
            <span>🏠 หน้าหลัก</span>
          </button>
        )}

        {onRestartGame && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.unlock();
              onRestartGame();
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white border border-sky-300/40 text-xs font-bold backdrop-blur-md flex items-center gap-1.5 shadow-xl transition-all cursor-pointer active:scale-95"
            title="เริ่มเล่นเกมรอบใหม่ รีเซ็ตคะแนนและเวลาทันที"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>🔄 เริ่มเกมใหม่</span>
          </button>
        )}

        {onEndGame && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.unlock();
              onEndGame();
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white border border-rose-300/40 text-xs font-bold backdrop-blur-md flex items-center gap-1.5 shadow-xl transition-all cursor-pointer active:scale-95"
            title="กดจบเกมและดูคะแนนสรุปทันที"
          >
            <span>🏁 จบเกมสรุปคะแนน</span>
          </button>
        )}

        {onOpenRules && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenRules();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-sky-200 border border-sky-400/30 text-xs font-bold backdrop-blur-md flex items-center gap-1.5 shadow-xl transition-all cursor-pointer"
            title="เปิดอ่านกฎกติกาการเล่น"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">กฎกติกา</span>
          </button>
        )}
      </div>

      {/* Floating Fullscreen Button on Ocean Surface */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          soundManager.unlock();
          onToggleFullscreen();
        }}
        className="absolute top-3 right-3 z-40 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
        title={isFullscreen ? 'ออกจากโหมดเต็มหน้าจอ' : 'เปิดโหมดเต็มหน้าจอขณะเล่น'}
      >
        {isFullscreen ? (
          <>
            <Minimize className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">ย่อจอ</span>
          </>
        ) : (
          <>
            <Maximize className="w-4 h-4 text-sky-300" />
            <span className="hidden sm:inline">เต็มหน้าจอ</span>
          </>
        )}
      </button>

      {/* --- SKY & HORIZON LAYER (Top 22%) --- */}
      <div className="absolute top-0 inset-x-0 h-[22%] pointer-events-none overflow-hidden z-10">
        {/* Bright Sunny Sun with Warm Glow */}
        <div className="absolute top-3 right-16 sm:right-28 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-300 shadow-[0_0_60px_rgba(253,224,71,1)] animate-pulse" />
        <div className="absolute top-4 right-18 sm:right-30 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-100" />

        {/* Fluffy White Clouds */}
        <div className="absolute top-3 left-10 flex items-center opacity-90">
          <div className="w-16 h-8 rounded-full bg-white shadow-md" />
          <div className="w-12 h-10 -ml-4 -mt-2 rounded-full bg-white shadow-md" />
          <div className="w-20 h-7 -ml-3 rounded-full bg-white shadow-md" />
        </div>

        <div className="absolute top-5 left-1/3 hidden sm:flex items-center opacity-80">
          <div className="w-12 h-6 rounded-full bg-white shadow-sm" />
          <div className="w-10 h-8 -ml-3 -mt-2 rounded-full bg-white shadow-sm" />
          <div className="w-14 h-5 -ml-2 rounded-full bg-white shadow-sm" />
        </div>

        {/* Distant Tropical Mountains */}
        <svg
          viewBox="0 0 1000 60"
          className="absolute bottom-0 inset-x-0 w-full h-12 text-teal-600/40"
          preserveAspectRatio="none"
        >
          <path d="M 0 50 Q 120 15 250 42 T 550 35 T 850 30 L 1000 48 L 1000 60 L 0 60 Z" fill="currentColor" />
        </svg>
      </div>

      {/* --- WATER SURFACE LINE AT 20% --- */}
      <div className="absolute top-[19%] inset-x-0 h-6 overflow-hidden pointer-events-none z-25">
        <div className="w-[200%] h-full flex animate-wave-slow opacity-85">
          <svg viewBox="0 0 1200 30" className="w-1/2 h-full text-cyan-200" preserveAspectRatio="none">
            <path d="M 0 15 Q 150 0 300 15 T 600 15 T 900 15 T 1200 15 L 1200 30 L 0 30 Z" fill="currentColor" />
          </svg>
          <svg viewBox="0 0 1200 30" className="w-1/2 h-full text-cyan-200" preserveAspectRatio="none">
            <path d="M 0 15 Q 150 0 300 15 T 600 15 T 900 15 T 1200 15 L 1200 30 L 0 30 Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* --- WOODEN BOAT & CHEERFUL FISHERMAN --- */}
      <div
        className="absolute z-30 pointer-events-none animate-boat"
        style={{ left: '5%', top: '10%' }}
      >
        <div className="relative">
          {/* Fisherman Mascot */}
          <div className="relative -mb-3 ml-8 text-3xl sm:text-4xl filter drop-shadow">
            🧑‍🌾
          </div>

          {/* Wooden Boat Hull with Bright Color Scheme */}
          <svg viewBox="0 0 180 50" className="w-36 sm:w-44 h-12 filter drop-shadow-xl">
            <path
              d="M 10 10 L 160 10 C 176 10 178 22 165 38 C 150 48 30 48 15 38 C 4 25 4 15 10 10 Z"
              fill="#92400e"
            />
            <path
              d="M 12 18 L 166 18 C 172 24 168 30 160 32 L 20 32 C 12 30 8 24 12 18 Z"
              fill="#f59e0b"
            />
            <path
              d="M 15 25 L 161 25"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 8 10 L 162 10"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* Thai Flag on Boat */}
          <div className="absolute top-2 left-2 text-sm transform -rotate-12">
            🚩
          </div>
        </div>
      </div>

      {/* --- UNIFIED FISHING LINE & HOOK (Full Canvas SVG) --- */}
      {/* Crucial requirement: "สายเบ็ดที่โยงขอให้โยงให้ถึงตัวปลาจริง ๆ" */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-35 overflow-visible"
      >
        {/* Draw the Fishing Rod from boat (x: 8, y: 18) up to rod tip (ROD_TIP_X: 18, ROD_TIP_Y: 14) */}
        <line
          x1="8"
          y1="18.5"
          x2={ROD_TIP_X}
          y2={ROD_TIP_Y}
          stroke="#78350f"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        {/* Metallic rod guide rings */}
        <circle cx="12" cy="16.5" r="0.5" fill="#fbbf24" />
        <circle cx="15" cy="15" r="0.5" fill="#fbbf24" />
        <circle cx={ROD_TIP_X} cy={ROD_TIP_Y} r="0.8" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.25" />

        {selectedFish ? (
          // REAL HOOKED FISHING LINE: Directly connects from Rod Tip (18, 14) to the Exact Fish Mouth!
          <g>
            {/* Outer high-visibility tension glow line */}
            <path
              d={`M ${ROD_TIP_X} ${ROD_TIP_Y} Q ${(ROD_TIP_X + targetMouthX) / 2 + 1} ${
                (ROD_TIP_Y + targetMouthY) / 2 - 4
              } ${targetMouthX} ${targetMouthY}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.2"
              opacity="0.8"
            />

            {/* Core bright white nylon fishing line */}
            <path
              d={`M ${ROD_TIP_X} ${ROD_TIP_Y} Q ${(ROD_TIP_X + targetMouthX) / 2 + 1} ${
                (ROD_TIP_Y + targetMouthY) / 2 - 4
              } ${targetMouthX} ${targetMouthY}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.55"
              strokeLinecap="round"
              className="drop-shadow-lg"
            />

            {/* Ripple rings and sparkle right at the fish mouth target */}
            <g transform={`translate(${targetMouthX}, ${targetMouthY})`}>
              <circle cx="0" cy="0" r="1.5" fill="#fde047" />
              <circle
                cx="0"
                cy="0"
                r="3.5"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.4"
                opacity="0.9"
                className="animate-ping"
              />
              <circle
                cx="0"
                cy="0"
                r="6"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="0.3"
                opacity="0.6"
              />
            </g>
          </g>
        ) : (
          // IDLE STATE: Line dangles into water with bobber
          <g>
            <path
              d={`M ${ROD_TIP_X} ${ROD_TIP_Y} Q ${ROD_TIP_X + 0.5} 18 ${ROD_TIP_X} 22`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.35"
              opacity="0.85"
            />
            {/* Red & White Fishing Bobber */}
            <circle cx={ROD_TIP_X} cy="21.5" r="1.1" fill="#ef4444" stroke="#ffffff" strokeWidth="0.2" />
            <circle cx={ROD_TIP_X} cy="22.5" r="1.1" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.2" />
            {/* Dangling hook beneath water surface */}
            <path
              d={`M ${ROD_TIP_X} 23.5 L ${ROD_TIP_X} 27.5 Q ${ROD_TIP_X} 29 ${ROD_TIP_X - 1} 28.5`}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="0.4"
            />
          </g>
        )}
      </svg>

      {/* --- SWIMMING FISHES (Unified Coordinate System) --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        {/* Shimmering Sunlight Caustics */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              background:
                'repeating-linear-gradient(115deg, transparent, transparent 35px, rgba(255,255,255,0.4) 45px, transparent 80px)',
            }}
          />
        </div>

        {/* Ambient Rising Air Bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute left-[12%] bottom-4 w-3.5 h-3.5 rounded-full bg-white/60 shadow-sm"
            style={{ animation: 'bubbleFloat 5s ease-in infinite' }}
          />
          <div
            className="absolute left-[30%] bottom-8 w-2 h-2 rounded-full bg-white/70"
            style={{ animation: 'bubbleFloat 4s ease-in infinite 1s' }}
          />
          <div
            className="absolute left-[52%] bottom-2 w-4 h-4 rounded-full bg-white/50"
            style={{ animation: 'bubbleFloat 6.5s ease-in infinite 0.5s' }}
          />
          <div
            className="absolute left-[75%] bottom-6 w-3 h-3 rounded-full bg-white/60"
            style={{ animation: 'bubbleFloat 4.8s ease-in infinite 1.8s' }}
          />
          <div
            className="absolute left-[88%] bottom-10 w-2.5 h-2.5 rounded-full bg-white/70"
            style={{ animation: 'bubbleFloat 5.2s ease-in infinite 2.5s' }}
          />
        </div>

        {/* Swimming Fish Sprites */}
        {fishes.map((fish) => (
          <FishSprite
            key={fish.id}
            fish={fish}
            isSelected={selectedFish?.id === fish.id}
            isHooked={selectedFish?.id === fish.id}
            escapeTimeLeft={selectedFish?.id === fish.id ? escapeTimeLeft : 3.0}
            onSelect={handleFishClick}
            onDragStart={handleDragStart}
          />
        ))}

        {/* Floating Scores / Text FX */}
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            className={`absolute pointer-events-none font-bold text-sm sm:text-base px-2.5 py-1 rounded-xl shadow-xl transition-transform animate-bounce z-50 ${
              ft.isCombo
                ? 'bg-amber-400 text-slate-950 text-lg border-2 border-white'
                : 'bg-slate-900/95 text-white border border-white/30'
            }`}
            style={{
              left: `${ft.x}%`,
              top: `${ft.y}%`,
              transform: 'translate(-50%, -50%)',
              color: ft.color,
            }}
          >
            {ft.text}
          </div>
        ))}

        {/* Audio helper banner if audio has not started yet */}
        {!hasInteractedAudio && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              soundManager.forceEnableAndPlay();
              setHasInteractedAudio(true);
            }}
            className="absolute bottom-16 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 border-2 border-white px-4 py-2 rounded-full shadow-2xl text-xs sm:text-sm font-bold cursor-pointer flex items-center gap-2 animate-bounce"
          >
            <Music className="w-4 h-4 text-slate-950" />
            <span>🔊 คลิกที่นี่เพื่อเปิดเพลงและเสียงเอฟเฟกต์ทันที! 🎶</span>
          </div>
        )}

        {/* Quick touch prompt banner when fish is hooked */}
        {selectedFish && (
          <div className="absolute bottom-3 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 bg-slate-950/95 border-2 border-amber-400 p-2 sm:p-3 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-2 z-45 max-w-lg backdrop-blur-md animate-scaleUp">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
              <span className="text-xl">🎣</span>
              <div>
                <span>เลือกตะกร้าสำหรับคำว่า </span>
                <span className="font-bold text-amber-300 text-base underline decoration-amber-400 decoration-2">
                  &ldquo;{selectedFish.wordItem.word}&rdquo;
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDropToBasket(1);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                ตะกร้า ๑ (ผู้พูด)
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDropToBasket(2);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                ตะกร้า ๒ (ผู้ฟัง)
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDropToBasket(3);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                ตะกร้า ๓ (ผู้ถูกกล่าวถึง)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
