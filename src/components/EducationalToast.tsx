/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PronounWord } from '../types/game';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface EducationalToastProps {
  word: PronounWord | null;
  isCorrect: boolean;
  userChosenPerson: number | null;
  onDismiss: () => void;
}

export const EducationalToast: React.FC<EducationalToastProps> = ({
  word,
  isCorrect,
  userChosenPerson: _userChosenPerson,
  onDismiss,
}) => {
  if (!word) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md animate-slideUp">
      <div
        onClick={onDismiss}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onDismiss();
        }}
        className={`p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md cursor-pointer transition-all ${
          isCorrect
            ? 'bg-emerald-950/90 border-emerald-400/50 text-white'
            : 'bg-rose-950/95 border-rose-400/50 text-white'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            {isCorrect ? (
              <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-300">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-1 rounded-full bg-rose-500/20 text-rose-300">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-sm flex items-center gap-1.5">
                <span>คำว่า "{word.word}"</span>
                <span
                  className={`text-xs px-2 py-0.2 rounded-full font-semibold ${
                    word.person === 1
                      ? 'bg-emerald-500/30 text-emerald-200'
                      : word.person === 2
                      ? 'bg-amber-500/30 text-amber-200'
                      : 'bg-purple-500/30 text-purple-200'
                  }`}
                >
                  สรรพนามบุรุษที่ {word.person === 1 ? '๑ (ผู้พูด)' : word.person === 2 ? '๒ (ผู้ฟัง)' : '๓ (ผู้ถูกกล่าวถึง)'}
                </span>
              </span>
            </div>

            <p className="text-xs text-slate-200 mt-1 leading-snug">
              {word.description}
            </p>

            <div className="mt-1.5 text-[11px] text-slate-300 italic bg-black/25 px-2 py-1 rounded-md">
              💬 "{word.example}"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
