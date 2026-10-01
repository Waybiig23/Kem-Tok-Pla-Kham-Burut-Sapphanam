/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, BookOpen, User, MessageSquare, Users, CheckCircle2 } from 'lucide-react';
import { PRONOUN_WORDS } from '../data/pronounData';
import { PronounPerson } from '../types/game';

interface KnowledgeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeGuideModal: React.FC<KnowledgeGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<PronounPerson | 'all'>(1);

  if (!isOpen) return null;

  const filteredWords =
    activeTab === 'all'
      ? PRONOUN_WORDS
      : PRONOUN_WORDS.filter((w) => w.person === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-sky-500/30 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                คลังความรู้เรื่องคำบุรุษสรรพนาม
              </h2>
              <p className="text-xs text-slate-400">
                เรียนรู้ชนิด หน้าที่ ระดับภาษา และตัวอย่างการใช้คำสรรพนาม
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-4 pt-3 pb-2 border-b border-white/5 bg-slate-900 flex gap-1.5 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 1
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>บุรุษที่ ๑ (ผู้พูด)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(2)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 2
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>บุรุษที่ ๒ (ผู้ฟัง)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(3)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 3
                ? 'bg-purple-500 text-white font-bold shadow-xs'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>บุรุษที่ ๓ (ผู้ถูกกล่าวถึง)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              activeTab === 'all'
                ? 'bg-sky-500 text-white font-bold shadow-xs'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            แสดงทั้งหมด
          </button>
        </div>

        {/* Content body with scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Quick Concept Box */}
          <div className="bg-sky-950/40 border border-sky-500/20 rounded-xl p-3.5 text-xs text-sky-200 leading-relaxed">
            <span className="font-bold text-sky-300">💡 เคล็ดลับการจำ:</span>
            <ul className="mt-1 space-y-1 text-slate-300 list-disc list-inside">
              <li>
                <strong className="text-emerald-300">สรรพนามบุรุษที่ ๑</strong> = แทนตัว <strong>ผู้พูด</strong> (ฉัน, ผม, หนู, เรา, ดิฉัน, ข้าพเจ้า, อาตมา)
              </li>
              <li>
                <strong className="text-amber-300">สรรพนามบุรุษที่ ๒</strong> = แทนตัว <strong>ผู้ฟัง/คู่สนทนา</strong> (คุณ, เธอ, ท่าน, นาย, แก, เอ็ง, โยม)
              </li>
              <li>
                <strong className="text-purple-300">สรรพนามบุรุษที่ ๓</strong> = แทนตัว <strong>ผู้ที่ถูกกล่าวถึง</strong> (เขา, มัน, พวกเขา, พระองค์)
              </li>
            </ul>
          </div>

          {/* Word cards table */}
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredWords.map((item) => {
              const personBadge =
                item.person === 1
                  ? { text: 'บุรุษที่ ๑ (ผู้พูด)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
                  : item.person === 2
                  ? { text: 'บุรุษที่ ๒ (ผู้ฟัง)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }
                  : { text: 'บุรุษที่ ๓ (ผู้ถูกกล่าวถึง)', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };

              return (
                <div
                  key={item.id}
                  className="bg-slate-800/80 border border-white/10 rounded-xl p-3.5 space-y-2 hover:border-sky-400/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-white tracking-wide">
                      {item.word}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${personBadge.color}`}
                    >
                      {personBadge.text}
                    </span>
                  </div>

                  <div className="text-xs text-sky-300 font-medium">
                    📌 หมวดหมู่: {item.categoryLabel}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400">
                    <span className="text-amber-300 font-semibold">ตัวอย่างประโยค: </span>
                    <span className="italic">"{item.example}"</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-white/10 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            รวมคำศัพท์ทั้งหมด {PRONOUN_WORDS.length} คำ
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>เข้าใจแล้ว พร้อมลุย!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
