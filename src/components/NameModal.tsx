/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Sparkles, Check } from 'lucide-react';
import { AVATAR_OPTIONS } from '../utils/leaderboard';

interface NameModalProps {
  isOpen: boolean;
  currentName: string;
  currentAvatar: string;
  onSave: (name: string, avatar: string) => void;
  onClose?: () => void;
  isInitialSetup?: boolean;
}

export const NameModal: React.FC<NameModalProps> = ({
  isOpen,
  currentName,
  currentAvatar,
  onSave,
  onClose,
  isInitialSetup = false,
}) => {
  const [name, setName] = useState(currentName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || '🧑‍🌾');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg('กรุณาพิมพ์ชื่อผู้เล่นก่อนเริ่มบันทึกคะแนนครับ');
      return;
    }
    setErrorMsg('');
    onSave(trimmed, selectedAvatar);
  };

  const quickNames = ['กัปตันปลา', 'น้องข้าวหอม', 'พี่ต้นกล้า', 'นักตกปลาจิ๋ว', 'สายธาร'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-sky-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/60 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-2xl">
            {selectedAvatar}
          </div>
          <h2 className="text-lg font-bold text-white">
            {isInitialSetup ? 'ยินดีต้อนรับสู่น่านน้ำบุรุษสรรพนาม!' : 'เปลี่ยนชื่อและไอคอนผู้เล่น'}
          </h2>
          <p className="text-xs text-sky-200/80 mt-1">
            พิมพ์ชื่อของคุณเพื่อบันทึกสถิติคะแนนลงตารางอันดับ
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label htmlFor="playerNameInput" className="block text-xs font-semibold text-slate-300 mb-1.5">
              ชื่อผู้เล่น / ฉายานักตกปลา:
            </label>
            <div className="relative">
              <input
                id="playerNameInput"
                type="text"
                maxLength={20}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="เช่น น้องฟ้าใส, กัปตันปลา..."
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                autoFocus
              />
              <User className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            {errorMsg && (
              <p className="text-[11px] text-rose-400 mt-1 font-medium">{errorMsg}</p>
            )}

            {/* Quick Suggestions */}
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400">ตัวอย่าง:</span>
              {quickNames.map((qn) => (
                <button
                  type="button"
                  key={qn}
                  onClick={() => setName(qn)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-sky-300 transition-colors"
                >
                  {qn}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              เลือกไอคอนประจำตัว:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all border ${
                    selectedAvatar === av
                      ? 'bg-sky-500/30 border-sky-400 ring-2 ring-sky-400 scale-105'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-2">
            {!isInitialSetup && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition-colors"
              >
                ยกเลิก
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{isInitialSetup ? 'เริ่มเล่นเกมตกปลา!' : 'บันทึกข้อมูล'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
