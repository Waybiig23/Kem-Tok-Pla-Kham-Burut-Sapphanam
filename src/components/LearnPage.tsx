/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, User, MessageSquare, Users, Search, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { PRONOUN_WORDS } from '../data/pronounData';
import { PronounPerson } from '../types/game';

interface LearnPageProps {
  onStartQuiz: () => void;
  onPlayGame: () => void;
  onGoHome?: () => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ onStartQuiz, onPlayGame, onGoHome }) => {
  const [selectedPerson, setSelectedPerson] = useState<PronounPerson | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWords = PRONOUN_WORDS.filter((word) => {
    const matchesPerson = selectedPerson === 'all' || word.person === selectedPerson;
    const matchesSearch =
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPerson && matchesSearch;
  });

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fadeIn text-slate-100">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 p-6 md:p-8 border border-sky-500/30 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>บทเรียนไวยากรณ์ภาษาไทย ๓ บุรุษ · Powered by ครูเวย์บิ๊ก</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            เรียนรู้คำบุรุษสรรพนามทั้ง ๓ บุรุษ
          </h1>

          <p className="text-sm md:text-base text-sky-100/90 leading-relaxed">
            <strong>คำบุรุษสรรพนาม</strong> คือ คำสรรพนามที่ใช้แทนคำนามในการสนทนา เพื่อไม่ต้องเอ่ยชื่อซ้ำ
            โดยแบ่งออกเป็น <strong>๓ ชนิด</strong> ตามบทบาทของผู้สื่อสารในบทสนทนา
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            {onGoHome && (
              <button
                type="button"
                onClick={onGoHome}
                className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-sky-200 border border-sky-400/30 font-bold text-xs md:text-sm shadow-md transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer"
              >
                <span>🏠 กลับหน้าหลัก</span>
              </button>
            )}
            <button
              type="button"
              onClick={onPlayGame}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs md:text-sm shadow-lg transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span>🎣 ฝึกตกปลา 3 บุรุษ (ตัวละ 10 คะแนน)</span>
            </button>
            <button
              type="button"
              onClick={onStartQuiz}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs md:text-sm shadow-lg transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span>📝 ทดสอบความรู้ด้วยข้อสอบ 30 ข้อ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative Water Ripple Circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-6 text-7xl opacity-20 pointer-events-none select-none">
          🐟
        </div>
      </div>

      {/* 3 Columns Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Person 1 Card */}
        <div className="rounded-2xl bg-slate-900/80 border-2 border-emerald-500/40 p-5 md:p-6 shadow-xl flex flex-col justify-between hover:border-emerald-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <User className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ผู้ส่งสาร
              </span>
            </div>

            <h2 className="text-lg font-bold text-white mb-1">
              สรรพนามบุรุษที่ ๑
            </h2>
            <p className="text-xs font-semibold text-emerald-300 mb-3">
              แทนตัว "ผู้พูด" หรือกลุ่มของผู้พูด
            </p>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              ใช้เมื่อผู้พูดต้องการอ้างอิงถึงตนเองในการสนทนา มีการเลือกใช้ตามระดับความสนิทสนม กาลเทศะ เพศ และสถานะ
            </p>

            <div className="space-y-2 text-xs">
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[11px]">คำสามัญ/สุภาพ:</span>
                <span className="font-semibold text-white">ฉัน, ผม, หนู, เรา, ดิฉัน</span>
              </div>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[11px]">ทางการ/ราชการ:</span>
                <span className="font-semibold text-white">ข้าพเจ้า, กระผม</span>
              </div>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[11px]">พระสงฆ์/ราชาศัพท์:</span>
                <span className="font-semibold text-white">อาตมา, อาตมภาพ, ข้าพระพุทธเจ้า, กระหม่อม</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400 italic">
            ตัวอย่าง: "<strong>ผม</strong> กำลังเขียนบทความภาษาไทยครับ"
          </div>
        </div>

        {/* Person 2 Card */}
        <div className="rounded-2xl bg-slate-900/80 border-2 border-amber-500/40 p-5 md:p-6 shadow-xl flex flex-col justify-between hover:border-amber-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ผู้รับสาร
              </span>
            </div>

            <h2 className="text-lg font-bold text-white mb-1">
              สรรพนามบุรุษที่ ๒
            </h2>
            <p className="text-xs font-semibold text-amber-300 mb-3">
              แทนตัว "ผู้ฟัง" หรือคู่สนทนา
            </p>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              ใช้เรียกบุคคลที่กำลังสนทนาด้วยโดยตรง เพื่อแสดงความสุภาพ ความสนิทสนม หรือความเคารพยกย่องตามสถานภาพ
            </p>

            <div className="space-y-2 text-xs">
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[11px]">คำสุภาพ/สามัญ:</span>
                <span className="font-semibold text-white">คุณ, เธอ, ท่าน, ตัวเอง</span>
              </div>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[11px]">เป็นกันเอง/สนิท/โบราณ:</span>
                <span className="font-semibold text-white">นาย, แก, เอ็ง</span>
              </div>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[11px]">พระสงฆ์/ราชาศัพท์:</span>
                <span className="font-semibold text-white">โยม, มหาบพิตร, ใต้เท้า, ใต้ฝ่าละอองธุลีพระบาท</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400 italic">
            ตัวอย่าง: "<strong>คุณ</strong> สะดวกรับสายตอนนี้ไหมครับ"
          </div>
        </div>

        {/* Person 3 Card */}
        <div className="rounded-2xl bg-slate-900/80 border-2 border-purple-500/40 p-5 md:p-6 shadow-xl flex flex-col justify-between hover:border-purple-400 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                บุคคลภายนอก
              </span>
            </div>

            <h2 className="text-lg font-bold text-white mb-1">
              สรรพนามบุรุษที่ ๓
            </h2>
            <p className="text-xs font-semibold text-purple-300 mb-3">
              แทน "ผู้ที่ถูกกล่าวถึง" ลับหลัง
            </p>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              ใช้แทนบุคคล สัตว์ หรือสิ่งของที่ไม่ได้อยู่ในวงสนทนาขณะนั้น แต่คู่สนทนากำลังพูดถึง
            </p>

            <div className="space-y-2 text-xs">
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[11px]">คำสามัญ/พหูพจน์:</span>
                <span className="font-semibold text-white">เขา, พวกเขา, เจ้าตัว</span>
              </div>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[11px]">สัตว์/สิ่งของ/กันเอง:</span>
                <span className="font-semibold text-white">มัน, พวกมัน</span>
              </div>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                <span className="text-slate-400 block text-[11px]">ยกย่อง/วรรณกรรม/ราชาศัพท์:</span>
                <span className="font-semibold text-white">ท่าน, หล่อน, พระองค์, พระองค์ท่าน</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400 italic">
            ตัวอย่าง: "<strong>เขา</strong> กำลังเดินทางมาสมทบกับเรา"
          </div>
        </div>
      </div>

      {/* Special Contextual Notice Box */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 md:p-5">
        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>ข้อสังเกตพิเศษที่มักออกข้อสอบบ่อยมาก!</span>
        </h3>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-white">คำว่า "ท่าน"</strong>: หากพูดกับบุคคลนั้นโดยตรงจะเป็น <strong>บุรุษที่ ๒</strong> (เช่น "ท่านครับ"), แต่หากกล่าวถึงลับหลังจะเป็น <strong>บุรุษที่ ๓</strong> (เช่น "ท่านนายกฯ ติดภารกิจ")
          </li>
          <li>
            <strong className="text-white">คำว่า "เธอ"</strong>: ปัจจุบันใช้เป็นบุรุษที่ ๒ (เช่น "เธอทำการบ้านหรือยัง") แต่ในภาษาเขียนบางครั้งใช้เป็นบุรุษที่ ๓ แทนสตรีได้
          </li>
          <li>
            <strong className="text-white">คำว่า "เรา"</strong>: ส่วนใหญ่เป็นบุรุษที่ ๑ แทนกลุ่มตนเอง แต่ผู้ใหญ่อาจใช้เรียกเด็กคู่สนทนาเป็นบุรุษที่ ๒ ได้ เช่น "เราชื่ออะไรหรือ"
          </li>
        </ul>
      </div>

      {/* Dictionary Search & Filter Table */}
      <div className="rounded-2xl bg-slate-900 border border-white/10 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📚 คลังคำศัพท์และตัวอย่างประโยค</span>
            <span className="text-xs font-normal text-slate-400">({filteredWords.length} คำ)</span>
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setSelectedPerson('all')}
                className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                  selectedPerson === 'all' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                type="button"
                onClick={() => setSelectedPerson(1)}
                className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                  selectedPerson === 1 ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                บุรุษที่ ๑ (ผู้พูด)
              </button>
              <button
                type="button"
                onClick={() => setSelectedPerson(2)}
                className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                  selectedPerson === 2 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                บุรุษที่ ๒ (ผู้ฟัง)
              </button>
              <button
                type="button"
                onClick={() => setSelectedPerson(3)}
                className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                  selectedPerson === 3 ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                บุรุษที่ ๓ (ผู้ถูกกล่าวถึง)
              </button>
            </div>

            {/* Search */}
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาคำศัพท์..."
                className="w-full pl-8 pr-3 py-1 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>
        </div>

        {/* Word Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {filteredWords.map((item) => {
            const badge =
              item.person === 1
                ? { text: 'บุรุษที่ ๑ (ผู้พูด)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
                : item.person === 2
                ? { text: 'บุรุษที่ ๒ (ผู้ฟัง)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }
                : { text: 'บุรุษที่ ๓ (ผู้ถูกกล่าวถึง)', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };

            return (
              <div
                key={item.id}
                className="bg-slate-800/70 border border-white/10 rounded-xl p-3.5 space-y-2 hover:border-sky-400/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">{item.word}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${badge.color}`}>
                    {badge.text}
                  </span>
                </div>
                <div className="text-[11px] text-sky-300 font-medium">
                  {item.categoryLabel}
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  {item.description}
                </p>
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 italic">
                  💬 "{item.example}"
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
