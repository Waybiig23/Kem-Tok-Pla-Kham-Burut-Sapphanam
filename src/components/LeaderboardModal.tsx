/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trophy, Medal, Search, Trash2, Copy, Check, Share2 } from 'lucide-react';
import { ScoreRecord } from '../types/game';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: ScoreRecord[];
  onClearRecords: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  records,
  onClearRecords,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'two_persons' | 'three_persons'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = records
    .filter((r) => {
      if (filterMode === 'all') return true;
      return r.gameMode === filterMode;
    })
    .filter((r) => r.playerName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCopyRecord = (rec: ScoreRecord) => {
    const text = `🎣 [ผลคะแนนเกมตกปลาคำบุรุษสรรพนาม] 🐟\nผู้เล่น: ${rec.playerName}\nคะแนน: ${rec.score.toLocaleString()} แต้ม\nความแม่นยำ: ${rec.accuracy}%\nคอมโบสูงสุด: ${rec.maxCombo} ครั้ง\nฉายา: ${rec.rankTitle}\nวันที่: ${rec.date}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(rec.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                ตารางอันดับนักตกปลาคำสรรพนาม
              </h2>
              <p className="text-xs text-slate-400">
                สถิติคะแนน ความแม่นยำ และคอมโบสูงสุดของผู้เล่นทุกคน
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

        {/* Filter & Search Bar */}
        <div className="px-4 py-3 border-b border-white/5 bg-slate-900/90 flex flex-wrap gap-2 items-center justify-between">
          {/* Mode Tabs */}
          <div className="flex gap-1 text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('two_persons')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'two_persons'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              2 บุรุษ
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('three_persons')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'three_persons'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              3 บุรุษ
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 min-w-[140px] max-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อผู้เล่น..."
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Records list */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              ยังไม่มีประวัติคะแนนในหมวดหมู่นี้ เริ่มเล่นเพื่อเป็นคนแรกเลย!
            </div>
          ) : (
            filtered.map((record, index) => {
              const isTop3 = index < 3;
              const medalIcon =
                index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`;

              return (
                <div
                  key={record.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    isTop3
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-slate-800/60 border-white/5 hover:border-white/15'
                  }`}
                >
                  {/* Left: Rank & Avatar & Name */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 flex items-center justify-center font-bold text-sm shrink-0">
                      {medalIcon}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-base shrink-0">
                      {record.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white truncate max-w-[130px] sm:max-w-[180px]">
                          {record.playerName}
                        </span>
                        {index === 0 && (
                          <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 rounded">
                            แชมป์
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                        <span>{record.rankTitle.split('(')[0]}</span>
                        <span>·</span>
                        <span>{record.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Scores & Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-base font-bold text-amber-300 tabular-nums">
                        {record.score.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-slate-400">แต้ม</span>
                      </div>
                      <div className="text-[11px] text-slate-400 tabular-nums">
                        แม่นยำ {record.accuracy}% · คอมโบ {record.maxCombo}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyRecord(record)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
                      title="คัดลอกผลคะแนนไปส่งการบ้าน"
                    >
                      {copiedId === record.id ? (
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

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('คุณต้องการล้างประวัติตารางคะแนนทั้งหมดใช่หรือไม่?')) {
                onClearRecords();
              }
            }}
            className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ล้างตารางคะแนน</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
