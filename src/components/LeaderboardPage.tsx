/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trophy, Medal, Award, Search, Trash2, Copy, Check, BarChart3, Globe, Gamepad2, HelpCircle, Home } from 'lucide-react';
import { ScoreRecord } from '../types/game';
import { ClearScoreModal } from './ClearScoreModal';

interface LeaderboardPageProps {
  records: ScoreRecord[];
  onClearRecords: () => void;
  onPlayGame: () => void;
  onStartQuiz: () => void;
  onGoHome?: () => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  records,
  onClearRecords,
  onPlayGame,
  onStartQuiz,
  onGoHome,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'fishing' | 'quiz'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const filtered = records
    .filter((r) => {
      if (filterType === 'all') return true;
      if (filterType === 'quiz') return r.type === 'quiz' || r.playerName.includes('สอบ');
      return r.type === 'fishing' || !r.playerName.includes('สอบ');
    })
    .filter((r) => r.playerName.toLowerCase().includes(searchQuery.toLowerCase()));

  const fishingRecords = records.filter((r) => r.type === 'fishing' || !r.playerName.includes('สอบ'));
  const quizRecords = records.filter((r) => r.type === 'quiz' || r.playerName.includes('สอบ'));

  const top3 = filtered.slice(0, 3);

  const handleCopyRecord = (rec: ScoreRecord) => {
    const isQuiz = rec.type === 'quiz' || rec.playerName.includes('สอบ');
    const text = `🏆 [ชาร์จอันดับคำบุรุษสรรพนาม] 🐟\nประเภท: ${isQuiz ? 'แบบทดสอบ 30 ข้อ' : 'เกมตกปลา 3 บุรุษ'}\nผู้เล่น: ${rec.playerName}\nคะแนน: ${rec.score.toLocaleString()} แต้ม\nความแม่นยำ: ${rec.accuracy}%\nฉายา: ${rec.rankTitle}\nวันที่: ${rec.date}\nPowered by ครูเวย์บิ๊ก`;
    navigator.clipboard?.writeText(text);
    setCopiedId(rec.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fadeIn text-slate-100">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/40 p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-inner">
            <Trophy className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                ชาร์จอันดับเกียรติยศ (Leaderboard Worldwide)
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-semibold">
                <Globe className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} />
                <span>ออนไลน์เชื่อมต่อทั่วโลก</span>
              </span>
            </div>
            <p className="text-xs md:text-sm text-sky-200/90 mt-0.5">
              บันทึกคะแนนจริงทั้ง <strong className="text-amber-300">เกมตกปลา</strong> และ <strong className="text-purple-300">แบบทดสอบ 30 ข้อ</strong> · Powered by ครูเวย์บิ๊ก
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {onGoHome && (
            <button
              type="button"
              onClick={onGoHome}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-200 border border-sky-400/30 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Home className="w-4 h-4 text-sky-400" />
              <span>หน้าหลัก</span>
            </button>
          )}
          <button
            type="button"
            onClick={onPlayGame}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>เล่นเกมตกปลา</span>
          </button>
          <button
            type="button"
            onClick={onStartQuiz}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>ทำข้อสอบ 30 ข้อ</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-2 pb-2">
          {/* 2nd Place */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-400/30 p-3 sm:p-4 text-center space-y-1.5 shadow-lg h-52 flex flex-col justify-end">
            <div className="text-3xl sm:text-4xl">{top3[1].avatar}</div>
            <div className="text-xl">🥈</div>
            <div className="font-bold text-xs sm:text-sm text-white truncate">
              {top3[1].playerName}
            </div>
            <div className="text-amber-300 font-bold text-sm sm:text-base tabular-nums">
              {top3[1].score.toLocaleString()} แต้ม
            </div>
            <div className="text-[10px] text-slate-400">
              {top3[1].type === 'quiz' ? '📝 ข้อสอบ 30 ข้อ' : '🎣 เกมตกปลา'}
            </div>
          </div>

          {/* 1st Place */}
          <div className="rounded-3xl bg-gradient-to-b from-amber-950/90 via-slate-900 to-slate-900 border-2 border-amber-400 p-4 sm:p-5 text-center space-y-2 shadow-2xl h-64 flex flex-col justify-end ring-4 ring-amber-400/30">
            <div className="text-4xl sm:text-5xl animate-bounce">{top3[0].avatar}</div>
            <div className="text-2xl">👑 🥇</div>
            <div className="font-bold text-sm sm:text-base text-amber-300 truncate">
              {top3[0].playerName}
            </div>
            <div className="text-amber-200 font-black text-xl sm:text-2xl tabular-nums drop-shadow">
              {top3[0].score.toLocaleString()} แต้ม
            </div>
            <div className="text-[11px] font-semibold text-emerald-400">
              ความแม่นยำ {top3[0].accuracy}%
            </div>
            <div className="text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30">
              {top3[0].type === 'quiz' ? '📝 ข้อสอบ 30 ข้อ' : '🎣 เกมตกปลา'} (แชมป์เปี้ยน)
            </div>
          </div>

          {/* 3rd Place */}
          <div className="rounded-3xl bg-slate-900/90 border border-amber-700/30 p-3 sm:p-4 text-center space-y-1.5 shadow-lg h-44 flex flex-col justify-end">
            <div className="text-3xl sm:text-4xl">{top3[2].avatar}</div>
            <div className="text-xl">🥉</div>
            <div className="font-bold text-xs sm:text-sm text-white truncate">
              {top3[2].playerName}
            </div>
            <div className="text-amber-300 font-bold text-sm sm:text-base tabular-nums">
              {top3[2].score.toLocaleString()} แต้ม
            </div>
            <div className="text-[10px] text-slate-400">
              {top3[2].type === 'quiz' ? '📝 ข้อสอบ 30 ข้อ' : '🎣 เกมตกปลา'}
            </div>
          </div>
        </div>
      )}

      {/* Dual Comparison Bar Charts: Fishing vs Quiz */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fishing Game Chart */}
        <div className="rounded-3xl bg-slate-900/90 border border-emerald-500/30 p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>🎣 ชาร์จคะแนนเกมตกปลา 3 บุรุษ</span>
            </h2>
            <span className="text-[11px] text-slate-400">ตัวละ 10 คะแนน</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {fishingRecords.slice(0, 4).map((r, idx) => {
              const maxFishScore = Math.max(...fishingRecords.map((item) => item.score), 100);
              const width = Math.max(12, Math.round((r.score / maxFishScore) * 100));

              return (
                <div key={r.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <span>{idx + 1}.</span>
                      <span>{r.avatar}</span>
                      <span className="truncate max-w-[130px]">{r.playerName}</span>
                    </span>
                    <span className="text-emerald-300 font-bold tabular-nums">
                      {r.score.toLocaleString()} แต้ม
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 30-Question Quiz Chart */}
        <div className="rounded-3xl bg-slate-900/90 border border-purple-500/30 p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-purple-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>📝 ชาร์จคะแนนแบบทดสอบ 30 ข้อ</span>
            </h2>
            <span className="text-[11px] text-slate-400">เต็ม 30 ข้อ (3,000 แต้ม)</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {quizRecords.slice(0, 4).map((r, idx) => {
              const maxQuizScore = 3000;
              const width = Math.max(12, Math.round((r.score / maxQuizScore) * 100));

              return (
                <div key={r.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <span>{idx + 1}.</span>
                      <span>{r.avatar}</span>
                      <span className="truncate max-w-[130px]">{r.playerName}</span>
                    </span>
                    <span className="text-purple-300 font-bold tabular-nums">
                      {r.score.toLocaleString()} แต้ม ({r.accuracy}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-fuchsia-500 rounded-full transition-all duration-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full Leaderboard Table with Search & Filter */}
      <div className="rounded-3xl bg-slate-900 border border-white/10 p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ทั้งหมด ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('fishing')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterType === 'fishing'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎣 เกมตกปลา
            </button>
            <button
              type="button"
              onClick={() => setFilterType('quiz')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterType === 'quiz'
                  ? 'bg-purple-500 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📝 แบบทดสอบ 30 ข้อ
            </button>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อผู้เล่น..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2.5 pt-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              ไม่พบข้อมูลคะแนนในหมวดหมู่นี้
            </div>
          ) : (
            filtered.map((item, index) => {
              const medal =
                index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`;
              const isQuiz = item.type === 'quiz' || item.playerName.includes('สอบ');

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-800/70 border border-white/10 hover:border-white/20 transition-colors flex items-center justify-between gap-3 text-xs shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 font-bold text-center text-sm">{medal}</div>
                    <div className="w-9 h-9 rounded-full bg-slate-700/80 border border-white/10 flex items-center justify-center text-lg shrink-0">
                      {item.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white truncate max-w-[150px] sm:max-w-[260px]">
                          {item.playerName}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.2 rounded-full border font-semibold ${
                            isQuiz
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {isQuiz ? '📝 ข้อสอบ' : '🎣 ตกปลา'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.rankTitle} · {item.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-base font-bold text-amber-300 tabular-nums">
                        {item.score.toLocaleString()} แต้ม
                      </div>
                      <div className="text-[10px] text-slate-400 tabular-nums">
                        แม่นยำ {item.accuracy}%
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyRecord(item)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 transition-colors cursor-pointer"
                      title="คัดลอกผลคะแนน"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Clear Button & Protected Action */}
        {/* Requirement: "และสามารถกดล้างคะแนนได้จริง แต่ใส่รหัส 237280 ไม่ต้องโชว์ด้วย" */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap justify-between items-center gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Powered by ครูเวย์บิ๊ก</span>
            <span>·</span>
            <span>เชื่อมต่อฐานข้อมูลคะแนนทั่วโลก</span>
          </div>

          <button
            type="button"
            onClick={() => setIsClearModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ล้างตารางคะแนน (ใส่รหัสผ่าน)</span>
          </button>
        </div>
      </div>

      {/* Clear Score Modal with masked password input */}
      <ClearScoreModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onSuccess={() => {
          onClearRecords();
        }}
      />
    </div>
  );
};
