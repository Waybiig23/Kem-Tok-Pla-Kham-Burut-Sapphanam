/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PronounPerson, GameMode } from '../types/game';
import { BASKETS_DATA } from '../data/pronounData';
import { User, MessageSquare, Users } from 'lucide-react';

interface BasketsProps {
  gameMode: GameMode;
  selectedFishPerson: PronounPerson | null;
  basketCounts: Record<PronounPerson, number>;
  onDropFish: (person: PronounPerson) => void;
  wobbleBasket: PronounPerson | null;
}

export const Baskets: React.FC<BasketsProps> = ({
  gameMode: _gameMode,
  selectedFishPerson: _selectedFishPerson,
  basketCounts,
  onDropFish,
  wobbleBasket,
}) => {
  const [dragOverPerson, setDragOverPerson] = useState<PronounPerson | null>(null);

  // Always show all 3 personal pronoun baskets
  const activePersons: PronounPerson[] = [1, 2, 3];

  const handleDragOver = (e: React.DragEvent, person: PronounPerson) => {
    e.preventDefault();
    setDragOverPerson(person);
  };

  const handleDragLeave = () => {
    setDragOverPerson(null);
  };

  const handleDrop = (e: React.DragEvent, person: PronounPerson) => {
    e.preventDefault();
    setDragOverPerson(null);
    onDropFish(person);
  };

  const renderIcon = (person: PronounPerson) => {
    if (person === 1) return <User className="w-5 h-5 text-emerald-300" />;
    if (person === 2) return <MessageSquare className="w-5 h-5 text-amber-300" />;
    return <Users className="w-5 h-5 text-purple-300" />;
  };

  return (
    <div className="relative z-30 w-full max-w-5xl mx-auto px-2 pt-2 pb-1">
      <div className="grid gap-3 md:gap-4 grid-cols-3">
        {activePersons.map((person) => {
          const config = BASKETS_DATA[person];
          const isDraggingOver = dragOverPerson === person;
          const isWobbling = wobbleBasket === person;
          const count = basketCounts[person] || 0;

          return (
            <div
              key={person}
              onDragOver={(e) => handleDragOver(e, person)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, person)}
              onClick={() => onDropFish(person)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onDropFish(person);
                }
              }}
              aria-label={`${config.title} ${config.subtitle}`}
              className={`relative group cursor-pointer transition-all duration-200 select-none rounded-2xl p-3 md:p-4 border-2 text-left shadow-lg overflow-hidden ${
                isDraggingOver
                  ? 'border-yellow-300 ring-4 ring-yellow-400/40 scale-102 bg-slate-900/90'
                  : `${config.borderColor} bg-slate-900/75 hover:bg-slate-900/90 hover:shadow-xl`
              } ${isWobbling ? 'animate-bounce' : ''}`}
            >
              {/* Background gradient & wicker weave pattern */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${config.bgGradient} opacity-60 group-hover:opacity-80 transition-opacity`}
              />

              {/* Basket rim and woven texture details */}
              <div
                className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 opacity-80"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.2) 5px, rgba(0,0,0,0.2) 10px)',
                }}
              />

              <div className="relative z-10 flex flex-col justify-between h-full min-h-[96px] md:min-h-[110px]">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 shrink-0">
                      {renderIcon(person)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm md:text-base font-bold text-white tracking-wide">
                          {config.title}
                        </h3>
                        <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-semibold rounded bg-white/15 text-white/90">
                          คีย์ {person}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium line-clamp-1">
                        {config.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Fish Counter Inside Basket */}
                  <div className="text-right shrink-0 bg-black/40 px-2 py-1 rounded-lg border border-white/10">
                    <div className="text-[10px] text-slate-400 font-medium">ปลาในตะกร้า</div>
                    <div className="text-base md:text-lg font-bold text-amber-300 tabular-nums">
                      {count} <span className="text-xs font-normal text-slate-300">ตัว</span>
                    </div>
                  </div>
                </div>

                {/* Example sample words */}
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-300/80 text-[11px] truncate mr-2">
                    ตัวอย่าง: {config.sampleWords}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDropFish(person);
                    }}
                    className="shrink-0 px-2.5 py-1 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 flex items-center gap-1 group-hover:border-amber-400"
                  >
                    <span>ยกใส่ตะกร้า</span>
                    <span className="font-mono text-[10px] text-amber-300">({person})</span>
                  </button>
                </div>
              </div>

              {/* Water droplet shine effect */}
              <div className="absolute top-2 right-12 w-8 h-8 rounded-full bg-white/5 blur-sm pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
