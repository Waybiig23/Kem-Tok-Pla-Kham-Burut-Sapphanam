/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FishItem, CreatureType } from '../types/game';
import { soundManager } from '../utils/sound';

interface FishSpriteProps {
  fish: FishItem;
  isSelected?: boolean;
  isHooked?: boolean;
  escapeTimeLeft?: number;
  onSelect?: (fish: FishItem) => void;
  onDragStart?: (e: React.DragEvent, fish: FishItem) => void;
}

export const FishSprite: React.FC<FishSpriteProps> = ({
  fish,
  isSelected,
  isHooked,
  escapeTimeLeft = 3.0,
  onSelect,
  onDragStart,
}) => {
  const isFacingLeft = fish.direction === 'left';
  const creatureType: CreatureType = fish.creatureType || 'fish';

  const handleInteract = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    soundManager.unlock();
    onSelect?.(fish);
  };

  const creatureLabel = {
    whale: '🐋 วาฬยักษ์สีน้ำเงิน',
    shark: '🦈 ฉลามขาวจอมล่า',
    dinosaur: '🦕 ไดโนเสาร์สมุทรเพลซิโอซอร์',
    stingray: '🪸 ปลากระเบนราหู',
    fish: '🐟 ปลาทะเลปะการัง',
  }[creatureType];

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${creatureLabel} คำว่า ${fish.wordItem.word}`}
      draggable
      onDragStart={(e) => onDragStart?.(e, fish)}
      onPointerDown={handleInteract}
      onClick={handleInteract}
      className={`absolute select-none cursor-pointer group touch-manipulation focus:outline-none ${
        isHooked ? 'animate-struggle' : ''
      }`}
      style={{
        left: `${fish.x}%`,
        top: `${fish.y}%`,
        transform: `translate(-50%, -50%) scale(${fish.scale * (isHooked ? 1.08 : 1)})`,
        zIndex: isSelected || isHooked ? 45 : 20,
        transition: isHooked ? 'none' : 'transform 0.15s ease-out',
      }}
    >
      <div
        className={`relative flex items-center justify-center transition-all ${
          isFacingLeft ? 'scale-x-[-1]' : 'scale-x-100'
        } ${isSelected ? 'ring-4 ring-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.9)] rounded-2xl' : ''}`}
      >
        {/* Special sparkle shimmer */}
        {fish.isSpecial && (
          <div className="absolute -inset-4 rounded-3xl bg-yellow-400/25 animate-ping pointer-events-none" />
        )}

        {/* ========================================================
            1. REALISTIC BLUE / HUMPBACK WHALE (วาฬยักษ์สีน้ำเงิน)
            Anatomy: Baleen rostrum, blowhole mist, ventral throat pleats,
            knobby pectoral tubercles, small dorsal fin, broad flukes.
           ======================================================== */}
        {creatureType === 'whale' && (
          <svg viewBox="0 0 240 120" className="w-52 h-26 md:w-64 md:h-32 filter drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id={`whale-body-${fish.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="35%" stopColor="#254060" />
                <stop offset="65%" stopColor="#3b698f" />
                <stop offset="100%" stopColor="#8ba5ba" />
              </linearGradient>
              <linearGradient id={`whale-belly-${fish.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d5e3ec" />
                <stop offset="100%" stopColor="#a3bfd4" />
              </linearGradient>
              <linearGradient id={`whale-flipper-${fish.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e344d" />
                <stop offset="100%" stopColor="#416b90" />
              </linearGradient>
            </defs>

            {/* Blowhole water vapor spout */}
            <g className="animate-pulse">
              <path d="M 160 22 C 158 8 148 2 142 5 C 145 10 152 13 158 24 Z" fill="#7dd3fc" opacity="0.8" />
              <path d="M 164 22 C 168 7 180 3 186 7 C 182 12 172 14 165 24 Z" fill="#38bdf8" opacity="0.8" />
              <circle cx="142" cy="4" r="3" fill="#bae6fd" opacity="0.9" />
              <circle cx="186" cy="6" r="3" fill="#bae6fd" opacity="0.9" />
              <circle cx="164" cy="2" r="3.5" fill="#ffffff" opacity="0.95" />
            </g>

            {/* Caudal Flukes (Broad whale tail with median notch) */}
            <g className="animate-fish-tail">
              <path
                d="M 38 60 C 24 38 8 26 2 34 C 14 52 26 56 12 68 C 6 82 22 78 38 64 Z"
                fill="#1e2d42"
              />
              <path
                d="M 38 60 C 26 44 14 34 8 40 C 18 52 26 56 16 66 C 12 76 24 72 38 62 Z"
                fill="#2c4769"
                opacity="0.6"
              />
            </g>

            {/* Small falcate dorsal fin */}
            <path d="M 95 38 C 98 28 108 26 112 30 C 108 34 104 38 98 42 Z" fill="#1b2a3d" />

            {/* Main Whale Body: Hydrodynamic torpedo silhouette */}
            <path
              d="M 38 60 C 35 42 65 30 130 30 C 175 30 215 42 225 60 C 228 66 220 74 200 84 C 160 100 105 100 65 84 C 45 76 38 68 38 60 Z"
              fill={`url(#whale-body-${fish.id})`}
            />

            {/* Ventral Throat Grooves (Accordion pleats of rorqual whale) */}
            <path
              d="M 90 74 C 125 96 175 92 210 74 C 185 86 130 90 90 74 Z"
              fill={`url(#whale-belly-${fish.id})`}
            />
            {/* Fine anatomical groove lines */}
            <path d="M 120 76 Q 135 90 155 88" stroke="#52789c" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
            <path d="M 140 76 Q 155 90 175 86" stroke="#52789c" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
            <path d="M 160 74 Q 175 88 195 82" stroke="#52789c" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
            <path d="M 105 76 Q 118 88 135 88" stroke="#52789c" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />

            {/* Realistic Baleen Mouth Line */}
            <path
              d="M 225 60 C 215 68 185 70 165 66"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Subtle baleen fringe texture */}
            <path
              d="M 220 62 Q 200 68 180 66"
              stroke="#cbd5e1"
              strokeWidth="1.2"
              strokeDasharray="2,2"
              fill="none"
              opacity="0.8"
            />

            {/* Long Humpback Pectoral Flipper with leading edge knobby tubercles */}
            <path
              d="M 130 68 C 145 78 152 102 142 112 C 132 110 125 96 122 82 C 122 74 126 70 130 68 Z"
              fill={`url(#whale-flipper-${fish.id})`}
              stroke="#152438"
              strokeWidth="1"
            />
            {/* Tubercles (knobs on flipper) */}
            <circle cx="140" cy="106" r="1.8" fill="#e2e8f0" />
            <circle cx="144" cy="98" r="1.8" fill="#e2e8f0" />
            <circle cx="146" cy="90" r="1.8" fill="#e2e8f0" />

            {/* Realistic Cetacean Eye (Mammalian eyelid and dark iris) */}
            <ellipse cx="185" cy="56" rx="4" ry="3" fill="#0f172a" />
            <circle cx="186" cy="55" r="1.5" fill="#38bdf8" />
            <circle cx="186.5" cy="54.5" r="0.6" fill="#ffffff" />
            <path d="M 180 54 Q 185 52 190 54" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" fill="none" />

            {/* Hook attaching directly into realistic mouth at (224, 60) */}
            {isHooked && (
              <g className="animate-pulse">
                <path d="M 224 40 L 224 60 C 224 66 216 68 214 62 C 212 57 218 54 221 54" fill="none" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
                <circle cx="224" cy="60" r="4" fill="#fde047" />
              </g>
            )}
          </svg>
        )}

        {/* ========================================================
            2. REALISTIC GREAT WHITE SHARK (ฉลามขาวจอมล่า)
            Anatomy: Conical snout, dark predatory eye, 5 gill slits,
            sharp serrated teeth, tall dorsal fin, countershading, keels.
           ======================================================== */}
        {creatureType === 'shark' && (
          <svg viewBox="0 0 240 120" className="w-52 h-26 md:w-64 md:h-32 filter drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id={`shark-dorsal-${fish.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
              <linearGradient id={`shark-belly-${fish.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
            </defs>

            {/* Tall iconic Triangular First Dorsal Fin */}
            <path
              d="M 105 44 L 132 10 C 135 12 138 20 134 30 L 148 44 Z"
              fill="#2e3b4e"
              stroke="#1e293b"
              strokeWidth="1"
            />
            {/* Second small dorsal fin */}
            <path d="M 62 48 L 68 40 L 72 48 Z" fill="#334155" />

            {/* Realistic Heterocercal Caudal Fin (Tail) */}
            <g className="animate-fish-tail">
              {/* Upper large lobe */}
              <path
                d="M 38 56 C 24 30 10 16 4 24 C 12 40 24 50 14 62 C 6 82 20 74 38 58 Z"
                fill="#2c394b"
              />
              <path
                d="M 38 56 C 28 36 18 26 12 32 C 18 44 26 50 18 60 C 12 72 22 66 38 58 Z"
                fill="#475569"
                opacity="0.6"
              />
            </g>

            {/* Streamlined Torpedo Apex Shark Body */}
            <path
              d="M 38 56 C 45 42 90 36 160 40 C 195 44 225 50 230 54 C 225 64 190 74 150 78 C 95 82 45 74 38 56 Z"
              fill={`url(#shark-dorsal-${fish.id})`}
            />

            {/* Sharp White Countershaded Belly */}
            <path
              d="M 65 66 C 105 76 155 76 195 62 C 215 57 225 54 225 54 C 215 62 185 76 145 78 C 100 80 65 74 65 66 Z"
              fill={`url(#shark-belly-${fish.id})`}
            />

            {/* Lateral Line sensory organ */}
            <path
              d="M 55 58 Q 130 52 205 52"
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="4,2"
              fill="none"
              opacity="0.6"
            />

            {/* Five Distinct Gill Slits */}
            <g opacity="0.85">
              <path d="M 152 46 Q 155 54 152 64" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M 157 47 Q 160 54 157 63" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M 162 48 Q 165 54 162 62" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M 167 49 Q 170 54 167 61" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M 172 50 Q 175 54 172 60" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </g>

            {/* Long Sickle-shaped Pectoral Fin */}
            <path
              d="M 135 62 L 168 68 L 146 96 C 138 92 130 80 135 62 Z"
              fill="#2e3b4e"
              stroke="#1e293b"
              strokeWidth="1"
            />

            {/* Realistic Dark Predatory Eye with Eyelid fold */}
            <circle cx="204" cy="48" r="4.5" fill="#020617" />
            <circle cx="205" cy="47.5" r="1.8" fill="#475569" />
            <circle cx="205.5" cy="47" r="0.8" fill="#ffffff" />
            <path d="M 198 46 Q 204 44 209 46" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none" />

            {/* Sensory Pores (Ampullae of Lorenzini on snout) */}
            <circle cx="220" cy="50" r="0.8" fill="#334155" />
            <circle cx="224" cy="52" r="0.8" fill="#334155" />
            <circle cx="218" cy="52" r="0.8" fill="#334155" />

            {/* Under-slung Gaping Jaw with Realistic Serrated White Teeth */}
            <path d="M 215 56 Q 198 66 182 58" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Razor sharp triangular teeth */}
            <polygon points="212,57 215,62 218,57" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
            <polygon points="206,58 209,64 212,58" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
            <polygon points="200,59 203,65 206,59" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
            <polygon points="194,59 197,64 200,59" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
            <polygon points="188,58 191,63 194,58" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />

            {/* Hook Biting into Shark Jaw at (218, 58) */}
            {isHooked && (
              <g className="animate-pulse">
                <path d="M 218 36 L 218 58 C 218 64 210 66 208 60 C 206 56 212 54 215 54" fill="none" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
                <circle cx="218" cy="58" r="4" fill="#fde047" />
              </g>
            )}
          </svg>
        )}

        {/* ========================================================
            3. REALISTIC AQUATIC DINOSAUR (ไดโนเสาร์สมุทร Plesiosaurus)
            Anatomy: Elongated S-curved 30-vertebra neck, hydrodynamic barrel torso,
            4 large wing-like paddles, reptilian skull, sharp needle teeth.
           ======================================================== */}
        {creatureType === 'dinosaur' && (
          <svg viewBox="0 0 250 130" className="w-56 h-28 md:w-68 md:h-34 filter drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id={`dino-skin-${fish.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="40%" stopColor="#0f766e" />
                <stop offset="80%" stopColor="#115e59" />
                <stop offset="100%" stopColor="#042f2e" />
              </linearGradient>
              <linearGradient id={`dino-belly-${fish.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ccfbf1" />
                <stop offset="100%" stopColor="#99f6e4" />
              </linearGradient>
            </defs>

            {/* Muscular Stabilizing Tail */}
            <g className="animate-fish-tail">
              <path
                d="M 40 76 C 22 66 8 58 2 64 C 6 76 16 84 10 92 C 4 104 22 96 40 82 Z"
                fill="#064e3b"
              />
              <path d="M 38 78 C 24 70 14 66 8 70 C 14 80 20 84 14 90 C 8 98 22 92 38 82 Z" fill="#0d9488" opacity="0.6" />
            </g>

            {/* Rear Hydrofoil Flippers (Pelvic paddles) */}
            <path
              d="M 68 84 C 55 106 48 118 64 122 C 78 118 84 102 78 86 Z"
              fill="#065f46"
              stroke="#042f2e"
              strokeWidth="1"
            />
            {/* Front Hydrofoil Flippers (Large Pectoral paddles) */}
            <path
              d="M 125 84 C 112 112 102 128 122 132 C 140 126 148 106 140 86 Z"
              fill="#065f46"
              stroke="#042f2e"
              strokeWidth="1"
            />

            {/* Hydrodynamic Barrel-shaped Torso */}
            <path
              d="M 40 76 C 40 56 75 50 120 54 C 145 56 162 66 165 78 C 165 94 130 102 85 102 C 55 102 40 92 40 76 Z"
              fill={`url(#dino-skin-${fish.id})`}
            />

            {/* Pale Camouflaged Underside */}
            <path
              d="M 60 88 C 88 100 130 98 152 86 C 138 94 95 98 60 88 Z"
              fill={`url(#dino-belly-${fish.id})`}
              opacity="0.8"
            />

            {/* Elegant S-curved Prehistoric Neck stretching upward to Head */}
            <path
              d="M 135 60 C 155 52 178 40 188 26 C 194 18 206 14 218 18 C 230 24 225 34 208 44 C 188 56 172 74 156 80 Z"
              fill={`url(#dino-skin-${fish.id})`}
            />

            {/* Subtle reptile scale skin mottling patterns */}
            <circle cx="160" cy="52" r="3" fill="#042f2e" opacity="0.4" />
            <circle cx="170" cy="42" r="2.5" fill="#042f2e" opacity="0.4" />
            <circle cx="182" cy="32" r="2.5" fill="#042f2e" opacity="0.4" />
            <circle cx="100" cy="68" r="4" fill="#042f2e" opacity="0.3" />
            <circle cx="115" cy="72" r="3.5" fill="#042f2e" opacity="0.3" />

            {/* Prehistoric Dorsal Ridge Spines along neck and spine */}
            <polygon points="145,52 150,44 155,52" fill="#5eead4" />
            <polygon points="160,42 165,34 170,42" fill="#5eead4" />
            <polygon points="175,32 180,24 185,32" fill="#5eead4" />
            <polygon points="105,52 110,45 115,52" fill="#5eead4" />
            <polygon points="85,53 90,46 95,53" fill="#5eead4" />

            {/* Reptilian Amber Eye with Vertical Slit Pupil */}
            <ellipse cx="212" cy="22" rx="4" ry="4" fill="#f59e0b" />
            <ellipse cx="212" cy="22" rx="1.2" ry="3.5" fill="#020617" />
            <circle cx="213" cy="20.5" r="0.8" fill="#ffffff" />
            <path d="M 207 19 Q 212 17 217 19" stroke="#042f2e" strokeWidth="1.2" strokeLinecap="round" fill="none" />

            {/* Nostril slit near eyes */}
            <ellipse cx="219" cy="20" rx="1" ry="0.6" fill="#042f2e" />

            {/* Realistic Predatory Jaws with Interlocking Needle-like Fangs */}
            <path d="M 228 26 Q 218 32 205 28" stroke="#042f2e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* Needle teeth */}
            <polygon points="214,25 216,30 218,25" fill="#ffffff" />
            <polygon points="220,25 222,31 224,25" fill="#ffffff" />
            <polygon points="225,26 227,31 229,26" fill="#ffffff" />
            <polygon points="217,29 219,25 221,29" fill="#ffffff" />

            {/* Hook attaching directly into Dino Head at (228, 26) */}
            {isHooked && (
              <g className="animate-pulse">
                <path d="M 228 10 L 228 26 C 228 32 220 34 218 28 C 216 24 222 22 225 22" fill="none" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
                <circle cx="228" cy="26" r="4" fill="#fde047" />
              </g>
            )}
          </svg>
        )}

        {/* ========================================================
            4. REALISTIC STINGRAY / MANTA RAY (ปลากระเบนราหู)
            Anatomy: Diamond pectoral disc wings with undulating movement,
            dorsal spiracles, long whip-like tail with barb, cephalic lobes.
           ======================================================== */}
        {creatureType === 'stingray' && (
          <svg viewBox="0 0 240 120" className="w-52 h-26 md:w-64 md:h-32 filter drop-shadow-xl overflow-visible">
            <defs>
              <linearGradient id={`ray-dorsal-${fish.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="40%" stopColor="#312e81" />
                <stop offset="80%" stopColor="#4338ca" />
                <stop offset="100%" stopColor="#3730a3" />
              </linearGradient>
              <linearGradient id={`ray-wing-${fish.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>

            {/* Extremely Long Slender Whip-like Tail with Venomous Barb */}
            <g className="animate-fish-tail">
              <path
                d="M 75 58 C 45 60 15 54 0 62 C 15 66 45 62 75 60 Z"
                fill="#1e1b4b"
              />
              {/* Serrated stinging barb */}
              <polygon points="60,56 68,54 62,60" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
            </g>

            {/* Broad Diamond-shaped Pectoral Wing Disc */}
            {/* Top Wing / Fin */}
            <path
              d="M 175 50 C 170 32 150 12 120 8 C 105 18 95 38 75 58 C 115 54 150 52 175 50 Z"
              fill={`url(#ray-wing-${fish.id})`}
              stroke="#1e1b4b"
              strokeWidth="1"
            />
            {/* Bottom Wing / Fin */}
            <path
              d="M 175 60 C 150 58 115 56 75 58 C 95 78 105 98 120 108 C 150 104 170 84 175 66 Z"
              fill={`url(#ray-wing-${fish.id})`}
              stroke="#1e1b4b"
              strokeWidth="1"
            />

            {/* Main Central Hydrodynamic Body Disc */}
            <path
              d="M 75 58 C 85 45 125 40 180 48 C 205 52 215 56 215 56 C 215 56 205 60 180 64 C 125 72 85 68 75 58 Z"
              fill={`url(#ray-dorsal-${fish.id})`}
            />

            {/* Spotted Eagle Ray / Blue Spotted Pattern across Wings */}
            <circle cx="130" cy="35" r="2.5" fill="#38bdf8" opacity="0.9" />
            <circle cx="145" cy="40" r="2.2" fill="#38bdf8" opacity="0.9" />
            <circle cx="115" cy="30" r="2" fill="#38bdf8" opacity="0.9" />
            <circle cx="105" cy="42" r="2.5" fill="#38bdf8" opacity="0.9" />
            <circle cx="130" cy="78" r="2.5" fill="#38bdf8" opacity="0.9" />
            <circle cx="145" cy="72" r="2.2" fill="#38bdf8" opacity="0.9" />
            <circle cx="115" cy="82" r="2" fill="#38bdf8" opacity="0.9" />
            <circle cx="105" cy="70" r="2.5" fill="#38bdf8" opacity="0.9" />

            {/* Cephalic Horns / Head Lobes */}
            <path d="M 210 52 C 218 50 224 53 226 55 C 224 57 218 56 210 54 Z" fill="#312e81" />
            <path d="M 210 56 C 218 55 224 57 226 59 C 224 61 218 60 210 58 Z" fill="#312e81" />

            {/* Realistic Elevated Dorsal Eyes & Spiracles (Breathing holes) */}
            <ellipse cx="190" cy="50" rx="3.5" ry="3" fill="#fde047" />
            <circle cx="190.5" cy="50" r="2" fill="#020617" />
            <circle cx="191" cy="49.5" r="0.7" fill="#ffffff" />
            {/* Spiracle cleft directly behind eye */}
            <path d="M 184 48 Q 183 52 184 54" stroke="#020617" strokeWidth="1.8" strokeLinecap="round" fill="none" />

            {/* Hook Biting into Ray Snout at (222, 56) */}
            {isHooked && (
              <g className="animate-pulse">
                <path d="M 222 38 L 222 56 C 222 62 214 64 212 58 C 210 54 216 52 219 52" fill="none" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
                <circle cx="222" cy="56" r="4" fill="#fde047" />
              </g>
            )}
          </svg>
        )}

        {/* ========================================================
            5. REALISTIC MARINE CORAL REEF FISH (ปลาทะเลปะการัง)
            Anatomy: Compressed oval body, spiny dorsal rays, operculum gill flap,
            lateral line, translucent fin rays, realistic fish eye & lips.
           ======================================================== */}
        {creatureType === 'fish' && (
          <svg viewBox="0 0 200 110" className="w-48 h-24 md:w-56 md:h-28 filter drop-shadow-lg overflow-visible">
            <defs>
              <linearGradient id={`reef-body-${fish.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="40%" stopColor="#0369a1" />
                <stop offset="75%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <linearGradient id={`reef-fin-${fish.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>

            {/* Spiny Dorsal Fin with Realistic Fin Rays */}
            <path
              d="M 65 32 Q 95 12 145 28 C 130 30 100 32 65 32 Z"
              fill={`url(#reef-fin-${fish.id})`}
              opacity="0.9"
            />
            {/* Fine translucent spines */}
            <path d="M 80 25 L 82 32" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
            <path d="M 95 20 L 97 32" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
            <path d="M 110 18 L 112 32" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
            <path d="M 125 20 L 126 32" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />

            {/* Ventral & Anal Fin */}
            <path
              d="M 85 78 Q 115 95 135 80 Z"
              fill={`url(#reef-fin-${fish.id})`}
              opacity="0.85"
            />

            {/* Forked Caudal Tail Fin with dynamic animation */}
            <g className="animate-fish-tail">
              <path
                d="M 40 55 C 20 28 8 20 2 32 C 10 48 18 55 10 62 C 2 78 18 72 40 58 Z"
                fill={`url(#reef-fin-${fish.id})`}
              />
              <path d="M 38 55 C 22 36 12 30 8 36 C 14 48 20 54 14 60 C 8 70 20 66 38 56 Z" fill="#0369a1" opacity="0.4" />
            </g>

            {/* Hydrodynamic Reef Fish Body */}
            <path
              d="M 40 55 C 44 28 95 24 145 40 C 168 48 178 52 178 52 C 178 52 168 58 145 68 C 95 86 44 80 40 55 Z"
              fill={`url(#reef-body-${fish.id})`}
            />

            {/* Operculum (Gill Cover Plate) */}
            <path
              d="M 148 40 C 142 48 142 62 148 68"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />

            {/* Realistic Lateral Line */}
            <path
              d="M 55 54 Q 105 48 152 52"
              stroke="#e0f2fe"
              strokeWidth="1.2"
              strokeDasharray="3,2"
              fill="none"
              opacity="0.6"
            />

            {/* Translucent Fan Pectoral Fin */}
            <path
              d="M 115 54 Q 138 60 128 72 Q 116 64 115 54 Z"
              fill={`url(#reef-fin-${fish.id})`}
              opacity="0.9"
            />

            {/* Realistic Fish Eye with glassy cornea and round black pupil */}
            <circle cx="160" cy="46" r="6" fill="#f8fafc" />
            <circle cx="160" cy="46" r="4.5" fill="#f59e0b" />
            <circle cx="160" cy="46" r="3" fill="#020617" />
            <circle cx="161.5" cy="44.5" r="1.2" fill="#ffffff" />

            {/* Realistic Fish Lips & Mouth */}
            <path
              d="M 174 50 Q 178 52 174 55 Q 170 53 174 50 Z"
              fill="#fb923c"
              stroke="#0f172a"
              strokeWidth="1"
            />

            {/* Hook Biting into Fish Mouth at (176, 52) */}
            {isHooked && (
              <g className="animate-pulse">
                <path d="M 176 34 L 176 52 C 176 58 168 60 166 54 C 164 50 170 48 173 48" fill="none" stroke="#f8fafc" strokeWidth="2.8" strokeLinecap="round" />
                <circle cx="176" cy="52" r="3.5" fill="#fde047" />
              </g>
            )}
          </svg>
        )}

        {/* Word Label - High contrast, legible typography */}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
            isFacingLeft ? 'scale-x-[-1]' : 'scale-x-100'
          }`}
          style={{ paddingLeft: isFacingLeft ? '0px' : '15px', paddingRight: isFacingLeft ? '15px' : '0px' }}
        >
          <div className="bg-slate-950/90 backdrop-blur-md text-white px-3 py-1 rounded-xl border border-sky-400/40 shadow-2xl text-center transform transition-transform group-hover:scale-105">
            <span className="text-sm md:text-base font-black tracking-wide text-white drop-shadow-md">
              {fish.wordItem.word}
            </span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="text-[10px] text-sky-300 font-semibold tracking-tight">
                {creatureLabel}
              </span>
              {fish.isSpecial && (
                <span className="text-[10px] text-amber-300 font-black">
                  ⭐ โบนัส!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Realistic rising air bubbles trailing behind */}
        <div className="absolute -top-1 left-2 w-2 h-2 rounded-full bg-white/50 animate-ping pointer-events-none" />
      </div>

      {/* 3-SECOND STRUGGLE & ESCAPE TENSION BAR */}
      {isHooked && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none min-w-[160px]">
          <div
            className={`px-3 py-0.5 rounded-full text-[11px] font-black shadow-2xl border flex items-center gap-1.5 whitespace-nowrap ${
              escapeTimeLeft < 1.0
                ? 'bg-rose-600 text-white border-white animate-ping'
                : escapeTimeLeft < 2.0
                ? 'bg-amber-500 text-slate-950 border-amber-200'
                : 'bg-emerald-500 text-slate-950 border-emerald-200'
            }`}
          >
            <span>⚠️ กำลังดิ้น!</span>
            <span className="font-mono font-black text-xs">{Math.max(0, escapeTimeLeft).toFixed(1)}s</span>
            <span className="text-[10px] opacity-90">(รีบเลือกตะกร้า!)</span>
          </div>

          {/* Tension meter countdown bar */}
          <div className="w-32 h-2 bg-slate-950/95 rounded-full mt-1 border border-white/50 overflow-hidden shadow-inner p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-75 ${
                escapeTimeLeft < 1.0
                  ? 'bg-gradient-to-r from-rose-500 to-red-600'
                  : escapeTimeLeft < 2.0
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-500'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, (escapeTimeLeft / 3.0) * 100))}%` }}
            />
          </div>
        </div>
      )}

      {/* Prompt on initial select if not hooked */}
      {isSelected && !isHooked && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap animate-bounce pointer-events-none z-50 border border-white">
          🎣 โดนเบ็ดแล้ว! เลือกลงตะกร้าด่วน 👇
        </div>
      )}
    </div>
  );
};
