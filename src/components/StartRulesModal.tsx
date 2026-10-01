/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Volume2, Sparkles, BookOpen, Clock, Trophy, Play, Check, ShieldCheck } from 'lucide-react';
import { AVATAR_OPTIONS } from '../utils/leaderboard';
import { speechManager } from '../utils/speech';
import { soundManager } from '../utils/sound';

interface StartRulesModalProps {
  isOpen: boolean;
  currentName: string;
  currentAvatar: string;
  isFirstStart?: boolean;
  onStartGame: (name: string, avatar: string) => void;
  onClose?: () => void;
}

export const StartRulesModal: React.FC<StartRulesModalProps> = ({
  isOpen,
  currentName,
  currentAvatar,
  isFirstStart = true,
  onStartGame,
  onClose,
}) => {
  const [name, setName] = useState(currentName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || '🧑‍🌾');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'rules'>('profile');

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg('กรุณาพิมพ์ชื่อผู้เล่นหรือเลือกชื่อตัวอย่างก่อนเริ่มเล่นครับ');
      return;
    }
    setErrorMsg('');
    soundManager.unlock();
    soundManager.forceEnableAndPlay();
    speechManager.speakWelcome();
    onStartGame(trimmed, selectedAvatar);
  };

  const quickNames = ['กัปตันปลา', 'น้องข้าวหอม', 'พี่ต้นกล้า', 'นักตกปลาจิ๋ว', 'สายธาร', 'น้องใบเตย'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-400/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-white my-auto animate-scaleUp">
        {/* Modal Top Banner */}
        <div className="p-5 bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border-b border-white/10 text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-3xl mb-2 shadow-lg">
            {selectedAvatar}
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            🎣 ยินดีต้อนรับสู่เกมตกปลา ๓ บุรุษ
          </h2>
          <p className="text-xs text-sky-200/90 mt-1">
            ใส่ชื่อผู้เล่นและอ่านกฎกติกาก่อนออกทะเลจับเวลากันเลย! · Powered by ครูเวย์บิ๊ก
          </p>

          {/* Tab Selector inside modal */}
          <div className="mt-4 flex gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 text-xs max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>ใส่ชื่อ & ไอคอน</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rules')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'rules'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>กฎกติกาการเล่น</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Profile & Name Setup */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div>
              <label htmlFor="startNameInput" className="block text-xs font-semibold text-slate-300 mb-1.5">
                ชื่อผู้เล่น / ฉายานักตกปลา:
              </label>
              <div className="relative">
                <input
                  id="startNameInput"
                  type="text"
                  maxLength={20}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="พิมพ์ชื่อของคุณ เช่น น้องข้าวหอม, กัปตันปลา..."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/20 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  autoFocus
                />
                <User className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              {errorMsg && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">{errorMsg}</p>
              )}

              {/* Quick Suggestions */}
              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400">เลือกชื่อด่วน:</span>
                {quickNames.map((qn) => (
                  <button
                    type="button"
                    key={qn}
                    onClick={() => {
                      setName(qn);
                      setErrorMsg('');
                    }}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-sky-200 transition-colors cursor-pointer"
                  >
                    {qn}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                เลือกไอคอนประจำตัว (Avatar):
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                      selectedAvatar === av
                        ? 'bg-amber-500/30 border-2 border-amber-400 scale-105 shadow-md shadow-amber-500/20'
                        : 'bg-black/30 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Rules Quick Preview Highlights */}
            <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>สรุปกติกาสำคัญ:</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>• <strong>สัตว์น้ำหลากหลายสมจริง:</strong> 🐋 วาฬยักษ์, 🦈 ฉลามขาว, 🦕 ไดโนเสาร์สมุทร, 🪸 ปลากระเบนราหู, 🐟 ปลาปะการัง</li>
                <li>• ⚠️ <strong>ระวังดิ้นหลุด:</strong> เมื่อติดเบ็ดแล้ว ต้องลากลงตะกร้า<strong>ภายใน 3 วินาที</strong> มิฉะนั้นจะดิ้นหลุดหนีไป!</li>
                <li>• <strong>จับเวลา 3 นาที</strong> หรือกดปุ่ม <strong>"🏁 จบเกม"</strong> ได้ตลอดเวลา (ได้ <strong>ตัวละ 10 คะแนน</strong>)</li>
                <li>• มี <strong>เสียงพูดภาษาไทย</strong> อ่านคำศัพท์และส่งเสียงชมเชย</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-bold text-sm shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>เริ่มเล่นเกมตกปลา ๓ บุรุษ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('rules')}
                className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
              >
                📖 อ่านกฎกติกาอย่างละเอียดก่อนเริ่ม
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Rules Detailed View */}
        {activeTab === 'rules' && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[460px] overflow-y-auto">
            {/* Rule 1: 3 Baskets */}
            <div className="rounded-2xl bg-slate-950/80 border border-white/10 p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 text-sm">
                <Trophy className="w-4 h-4" />
                <span>๑. หน้าที่ของตะกร้าสรรพนามทั้ง ๓ บุรุษ</span>
              </div>
              <div className="space-y-2 text-slate-200">
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                  <div className="font-bold text-emerald-300">🧺 ตะกร้าที่ ๑ (แทนผู้พูด):</div>
                  <div className="text-[11px] text-slate-300">
                    คำที่ใช้แทนตัวผู้พูดเอง เช่น <em>ฉัน, ผม, ข้าพเจ้า, ดิฉัน, หนู, เรา, ข้า, อาตมา</em>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                  <div className="font-bold text-amber-300">🧺 ตะกร้าที่ ๒ (แทนผู้ฟัง):</div>
                  <div className="text-[11px] text-slate-300">
                    คำที่ใช้แทนตัวคนที่เรากำลังคุยด้วย เช่น <em>เธอ, คุณ, ท่าน, ใต้เท้า, นาย, มึง, โยม</em>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30">
                  <div className="font-bold text-purple-300">🧺 ตะกร้าที่ ๓ (แทนผู้ถูกกล่าวถึง):</div>
                  <div className="text-[11px] text-slate-300">
                    คำที่ใช้แทนคนที่ไม่อยู่ในวงสนทนาหรือกำลังพูดถึง เช่น <em>เขา, มัน, พวกเขา, พระองค์, ท่าน (บุคคลที่ 3)</em>
                  </div>
                </div>
              </div>
            </div>

            {/* Rule 2: Controls & Audio */}
            <div className="rounded-2xl bg-slate-950/80 border border-white/10 p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-sky-300 text-sm">
                <Clock className="w-4 h-4" />
                <span>๒. เวลา คะแนน และวิธีเล่น</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-xs">
                <li>• <strong>จับเวลา 3 นาที (180 วินาที)</strong> ในโหมดแข่งขัน</li>
                <li>• <strong>สัตว์น้ำหลากหลายชนิด:</strong> 🐋 วาฬยักษ์, 🦈 ฉลามจอมพลัง, 🦕 ไดโนเสาร์สมุทร, 🐟 ปลาไวพริบ</li>
                <li>• ⚠️ <strong>กลไกดิ้นหลุดเบ็ด:</strong> เมื่อสัตว์น้ำติดเบ็ดแล้ว จะมีแถบนับถอยหลัง <strong>3 วินาที</strong> หากเลือกลงตะกร้าช้ากว่า 3 วิ สัตว์น้ำจะดิ้นหลุดหนีไปทันที!</li>
                <li>• ตอบถูกได้ <strong>ตัวละ 10 คะแนน</strong> และคอมโบจะเพิ่มขึ้นเรื่อย ๆ</li>
                <li>• <strong>จบเกมได้ทันที:</strong> สามารถกดปุ่ม <strong>"🏁 จบเกม"</strong> เพื่อสรุปคะแนนได้ทุกเมื่อ</li>
                <li>• <strong>เสียงพูดภาษาไทย:</strong> แตะตัวปลาเพื่อฟังเสียงอ่านคำสรรพนาม และฟังเสียงเฉลยเมื่อตอบถูก</li>
              </ul>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                ← ย้อนกลับไปใส่ชื่อ
              </button>

              <button
                type="button"
                onClick={() => handleSubmit()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>พร้อมเริ่มเล่นเกมแล้ว!</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
