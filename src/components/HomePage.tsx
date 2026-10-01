/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Gamepad2, BookOpen, HelpCircle, Trophy, Sparkles, Clock, Volume2, ShieldCheck, User } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { speechManager } from '../utils/speech';

interface HomePageProps {
  playerName: string;
  avatar: string;
  onOpenNameModal: () => void;
  onStartGame: () => void;
  onOpenLessons: () => void;
  onStartQuiz: () => void;
  onOpenLeaderboard: () => void;
  onOpenRules: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  playerName,
  avatar,
  onOpenNameModal,
  onStartGame,
  onOpenLessons,
  onStartQuiz,
  onOpenLeaderboard,
  onOpenRules,
}) => {
  const handleNav = (action: () => void, voiceMsg?: string) => {
    soundManager.unlock();
    soundManager.playOptionClick();
    if (voiceMsg) {
      speechManager.speak(voiceMsg, 1.0, 1.05);
    }
    action();
  };

  return (
    <div className="flex-1 w-full overflow-y-auto bg-gradient-to-b from-slate-950 via-sky-950 to-slate-950 text-white p-4 sm:p-6 lg:p-8 select-none">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
        {/* Hero Welcome Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-900/90 via-indigo-950/80 to-slate-900 border border-sky-400/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Background Decorative Sea Glow & Bubble Dots */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold tracking-wide shadow-sm">
                <span>🌊 สื่อการเรียนรู้วิชาภาษาไทยเชิงโต้ตอบ</span>
                <span>·</span>
                <span className="text-amber-300">ตัวละ 10 คะแนน</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
                เกมตกปลา <span className="bg-gradient-to-r from-sky-300 via-teal-300 to-amber-300 bg-clip-text text-transparent">คำบุรุษสรรพนาม</span> ๓ บุรุษ
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                ฝึกแยกแยะคำสรรพนามแทนผู้พูด (บุรุษที่ ๑), ผู้ฟัง (บุรุษที่ ๒) และผู้ถูกกล่าวถึง (บุรุษที่ ๓) พร้อมสัตว์ทะเลสมจริง วาฬยักษ์ ฉลามขาว ไดโนเสาร์สมุทร และปลากระเบนราหู!
              </p>
            </div>

            {/* Player Card Profile in Hero */}
            <div className="shrink-0 bg-slate-900/90 border border-white/15 p-4 rounded-2xl shadow-xl flex flex-col items-center min-w-[200px]">
              <div className="text-4xl mb-1 filter drop-shadow-md">{avatar}</div>
              <div className="font-bold text-base text-white truncate max-w-[170px]">
                {playerName || 'ผู้เล่นนิรนาม'}
              </div>
              <span className="text-[11px] text-sky-300 mb-3 font-medium">กะลาสีฝึกหัด</span>

              <button
                type="button"
                onClick={() => handleNav(onOpenNameModal)}
                className="w-full py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              >
                <User className="w-3.5 h-3.5 text-sky-400" />
                <span>เปลี่ยนชื่อ / ไอคอน</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            THE 3 PRIMARY CORE ACTION BUTTONS (As Requested):
            1. กดเริ่มเกม (Start Game)
            2. กดอ่านตำรา (Read Textbook/Lessons)
            3. กดทำข้อสอบ (Take Quiz/Exam 30 Questions)
           ======================================================== */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-display font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>เลือกกิจกรรมการเรียนรู้</span>
            </h2>
            <span className="text-xs text-slate-400">เลือกเมนูด้านล่างเพื่อเริ่มต้น</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* 1. ปุ่มเริ่มเกม (Start Fishing Game) */}
            <div
              onClick={() => handleNav(onStartGame, 'เข้าสู่เกมตกปลาคำบุรุษสรรพนามค่ะ ขอให้สนุกกับการเล่นนะคะ')}
              className="group relative rounded-3xl p-6 bg-gradient-to-b from-sky-900/60 via-slate-900/90 to-sky-950/80 border-2 border-sky-400/40 hover:border-sky-300 shadow-xl hover:shadow-[0_0_35px_rgba(56,189,248,0.35)] transition-all transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    🎣
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-sky-500/30 text-sky-200 text-[11px] font-bold border border-sky-400/30">
                    ยอดนิยม 🔥
                  </span>
                </div>

                <h3 className="text-xl font-display font-black text-white group-hover:text-sky-300 transition-colors mb-2">
                  เริ่มเล่นเกมตกปลา
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  จับเบ็ดตกปลาสมจริง (วาฬ ฉลาม ไดโนเสาร์ กระเบน) ลากลงตะกร้า ๓ บุรุษ ได้ตัวละ 10 คะแนน ระวังดิ้นหลุด 3 วิ!
                </p>
              </div>

              <div className="pt-2">
                <div className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 group-hover:from-sky-400 group-hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <Gamepad2 className="w-4 h-4 fill-slate-950" />
                  <span>กดเริ่มเกมตกปลาทันที</span>
                </div>
              </div>
            </div>

            {/* 2. ปุ่มอ่านตำรา (Read Textbook/Lessons) */}
            <div
              onClick={() => handleNav(onOpenLessons, 'ยินดีต้อนรับสู่หน้าอ่านตำราเรียนรู้คำบุรุษสรรพนามค่ะ')}
              className="group relative rounded-3xl p-6 bg-gradient-to-b from-emerald-950/60 via-slate-900/90 to-teal-950/80 border-2 border-emerald-500/40 hover:border-emerald-300 shadow-xl hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] transition-all transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    📖
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-[11px] font-bold border border-emerald-400/30">
                    เนื้อหาบทเรียน
                  </span>
                </div>

                <h3 className="text-xl font-display font-black text-white group-hover:text-emerald-300 transition-colors mb-2">
                  อ่านตำราเรียนรู้
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  สรุปหลักไวยากรณ์ คำสรรพนามแทนผู้พูด (บุรุษ ๑), ผู้ฟัง (บุรุษ ๒) และผู้ถูกกล่าวถึง (บุรุษ ๓) พร้อมตัวอย่างประโยค
                </p>
              </div>

              <div className="pt-2">
                <div className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:from-emerald-400 group-hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <BookOpen className="w-4 h-4" />
                  <span>กดอ่านตำราบทเรียน</span>
                </div>
              </div>
            </div>

            {/* 3. ปุ่มทำข้อสอบ (Take Quiz/Exam 30 Questions) */}
            <div
              onClick={() => handleNav(onStartQuiz, 'เข้าสู่ห้องสอบวัดความรู้ 30 ข้อ 20 นาทีค่ะ ขอให้โชคดีในการทำข้อสอบนะคะ')}
              className="group relative rounded-3xl p-6 bg-gradient-to-b from-amber-950/60 via-slate-900/90 to-orange-950/80 border-2 border-amber-500/40 hover:border-amber-300 shadow-xl hover:shadow-[0_0_35px_rgba(245,158,11,0.35)] transition-all transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    📝
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/30 text-amber-200 text-[11px] font-bold border border-amber-400/30">
                    30 ข้อ · 20 นาที
                  </span>
                </div>

                <h3 className="text-xl font-display font-black text-white group-hover:text-amber-300 transition-colors mb-2">
                  ทำข้อสอบวัดความรู้
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  ทดสอบความรู้ครบถ้วน 30 ข้อมาตรฐาน จับเวลา 20 นาที มีเฉลยละเอียดและบันทึกคะแนนลงชาร์จอันดับ
                </p>
              </div>

              <div className="pt-2">
                <div className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 group-hover:from-amber-400 group-hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <HelpCircle className="w-4 h-4" />
                  <span>กดทำข้อสอบ 30 ข้อ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation Row: Leaderboard & Game Rules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Leaderboard Card */}
          <div
            onClick={() => handleNav(onOpenLeaderboard)}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-400/60 shadow-lg flex items-center justify-between cursor-pointer transition-all hover:bg-slate-800/80"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">ตารางชาร์จอันดับผู้เล่น</h4>
                <p className="text-xs text-slate-400">ดูคะแนนสูงสุดของนักเรียนและผู้เล่นทุกคน</p>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-3 py-1.5 rounded-xl border border-purple-400/30">
              ดูอันดับ →
            </span>
          </div>

          {/* Rules Card */}
          <div
            onClick={() => handleNav(onOpenRules)}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-sky-500/30 hover:border-sky-400/60 shadow-lg flex items-center justify-between cursor-pointer transition-all hover:bg-slate-800/80"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-2xl">
                📖
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">กฎกติกาและวิธีเล่น</h4>
                <p className="text-xs text-slate-400">วิธีตกปลา คะแนนตัวละ 10 แต้ม และระบบดิ้นหลุด 3 วิ</p>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-300 bg-sky-500/20 px-3 py-1.5 rounded-xl border border-sky-400/30">
              อ่านกติกา →
            </span>
          </div>
        </div>

        {/* Quick Reference Summary for Thai Pronoun 3 Persons */}
        <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4" />
            <span>สรุปย่อคำบุรุษสรรพนามทั้ง ๓ บุรุษ</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <span>🧺 ตะกร้าที่ ๑: บุรุษที่ ๑ (แทนผู้พูด)</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                เช่น <em>ฉัน, ผม, ข้าพเจ้า, ดิฉัน, หนู, เรา, ข้า, อาตมา</em>
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <span>🧺 ตะกร้าที่ ๒: บุรุษที่ ๒ (แทนผู้ฟัง)</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                เช่น <em>เธอ, คุณ, ท่าน, ใต้เท้า, นาย, มึง, โยม</em>
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-1">
              <div className="font-bold text-purple-300 flex items-center gap-1.5">
                <span>🧺 ตะกร้าที่ ๓: บุรุษที่ ๓ (แทนผู้ถูกกล่าวถึง)</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                เช่น <em>เขา, มัน, พวกเขา, พระองค์, ท่าน (บุคคลที่ 3)</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
