/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Share2, Award, CheckCircle2, XCircle, Flame, Copy, Check, Home } from 'lucide-react';
import { ScoreRecord } from '../types/game';

interface GameOverModalProps {
  isOpen: boolean;
  scoreRecord: ScoreRecord;
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
  onGoHome?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  scoreRecord,
  onPlayAgain,
  onOpenLeaderboard,
  onGoHome,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#fbbf24', '#34d399', '#f43f5e', '#a855f7'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = `🎣 [ผลคะแนนเกมตกปลาคำบุรุษสรรพนาม] 🐟\nผู้เล่น: ${scoreRecord.playerName}\nคะแนนที่ได้: ${scoreRecord.score.toLocaleString()} แต้ม\nความแม่นยำ: ${scoreRecord.accuracy}%\nตกปลาได้: ${scoreRecord.fishCaught} ตัว (ถูก ${scoreRecord.correctCount} / ผิด ${scoreRecord.wrongCount})\nคอมโบสูงสุด: ${scoreRecord.maxCombo} ครั้ง\nฉายา: ${scoreRecord.rankTitle}\nวันที่: ${scoreRecord.date}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-sky-400/30 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-white animate-scaleUp">
        {/* Banner with avatar & trophy */}
        <div className="p-6 bg-gradient-to-b from-sky-950/90 via-slate-900 to-slate-900 text-center relative border-b border-white/10">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 mb-3 shadow-lg">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
            จบเกมการแข่งขัน!
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/80 mt-1">
            ยอดเยี่ยมมาก! บันทึกสถิติลงตารางคะแนนเรียบร้อยแล้ว
          </p>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs">
            <span>{scoreRecord.avatar}</span>
            <span className="font-semibold text-white">{scoreRecord.playerName}</span>
            <span>·</span>
            <span className="text-amber-300 font-bold">{scoreRecord.rankTitle}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Big Score Box */}
          <div className="bg-gradient-to-r from-amber-500/15 via-sky-500/15 to-emerald-500/15 border border-amber-400/30 rounded-2xl p-4 text-center">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              คะแนนรวมของคุณ
            </span>
            <div className="text-4xl sm:text-5xl font-black text-amber-300 tracking-tight tabular-nums mt-1 drop-shadow-sm">
              {scoreRecord.score.toLocaleString()}
            </div>
            <div className="text-xs text-sky-200 mt-1">
              ตกปลาสำเร็จ {scoreRecord.fishCaught} ตัว × 10 คะแนน = {scoreRecord.score} คะแนน
            </div>
          </div>

          {/* Details 3 columns */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-slate-800/80 border border-white/10 p-3 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ความแม่นยำ</span>
              </div>
              <div className="text-lg font-bold text-white tabular-nums">
                {scoreRecord.accuracy}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                ถูก {scoreRecord.correctCount} / ผิด {scoreRecord.wrongCount}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-white/10 p-3 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-semibold mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>คอมโบสูงสุด</span>
              </div>
              <div className="text-lg font-bold text-white tabular-nums">
                {scoreRecord.maxCombo} ครั้ง
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                ต่อเนื่องติดกัน
              </div>
            </div>

            <div className="bg-slate-800/80 border border-white/10 p-3 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-purple-400 text-xs font-semibold mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>โหมด</span>
              </div>
              <div className="text-sm font-bold text-white truncate mt-1">
                ๓ บุรุษครบเซ็ต
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {scoreRecord.date}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onPlayAgain}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>เล่นใหม่อีกครั้ง</span>
              </button>

              <button
                type="button"
                onClick={onOpenLeaderboard}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>ดูตารางอันดับ</span>
              </button>
            </div>

            {onGoHome && (
              <button
                type="button"
                onClick={onGoHome}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-200 border border-sky-400/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4 text-sky-400" />
                <span>🏠 กลับสู่หน้าหลัก</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">คัดลอกผลคะแนนเรียบร้อยแล้ว! พร้อมส่งครู</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>คัดลอกผลคะแนนไปส่งการบ้าน / แชร์ให้เพื่อน</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
