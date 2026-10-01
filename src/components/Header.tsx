/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Trophy, BookOpen, RotateCcw, Music, HelpCircle, Gamepad2, Maximize, Minimize, Home } from 'lucide-react';
import { GameDifficulty, GameMode, ActiveTab } from '../types/game';
import { soundManager } from '../utils/sound';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  score: number;
  combo: number;
  timeLeft: number;
  gameDifficulty: GameDifficulty;
  gameMode: GameMode;
  playerName: string;
  avatar: string;
  isMuted: boolean;
  isBgmEnabled: boolean;
  isFullscreen: boolean;
  onToggleSound: () => void;
  onToggleBGM: () => void;
  onToggleFullscreen: () => void;
  onOpenNameModal: () => void;
  onRestartGame: () => void;
  onEndGame?: () => void;
  onOpenRules: () => void;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
  onSwitchMode: (mode: GameMode) => void;
  onSwitchDifficulty: (diff: GameDifficulty) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  score,
  combo,
  timeLeft,
  gameDifficulty,
  gameMode,
  playerName,
  avatar,
  isMuted,
  isBgmEnabled,
  isFullscreen,
  onToggleSound,
  onToggleBGM,
  onToggleFullscreen,
  onOpenNameModal,
  onRestartGame,
  onEndGame,
  onOpenRules,
  isVoiceEnabled,
  onToggleVoice,
  onSwitchMode: _onSwitchMode,
  onSwitchDifficulty,
}) => {
  const formatGameTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="relative z-40 bg-slate-900/95 backdrop-blur-md border-b border-sky-500/20 text-white shadow-md">
      {/* Main Top Bar Contract: Zone 1 (Brand), Zone 2 (Nav links), Zone 3 (Actions) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-lg">
            🎣
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
              คำบุรุษสรรพนาม ๓ บุรุษ
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-sky-300/80">
              <button
                type="button"
                onClick={onOpenNameModal}
                className="hover:underline flex items-center gap-1 text-sky-200 cursor-pointer"
                title="คลิกเพื่อเปลี่ยนชื่อผู้เล่น"
              >
                <span>{avatar}</span>
                <span className="max-w-[80px] sm:max-w-[120px] truncate">{playerName || 'ผู้เล่น'}</span>
              </button>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300 font-semibold">ตัวละ 10 แต้ม</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span className="hidden sm:inline text-sky-200/90 font-medium">Powered by ครูเวย์บิ๊ก</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>หน้าหลัก</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('game')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'game'
                ? 'bg-sky-500 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>เกมตกปลา ๓ บุรุษ</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('learn')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'learn'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>หน้าเรียนรู้</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('quiz')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>ทำข้อสอบ 30 ข้อ (20 นาที)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('leaderboard')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>ชาร์จอันดับ</span>
          </button>
        </nav>

        {/* Zone 3: Audio & Game Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Return to Home Button (Directly requested: "ปุ่มกลับหน้าหลักด้วย") */}
          {activeTab !== 'home' && (
            <button
              type="button"
              onClick={() => onSelectTab('home')}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-200 border border-sky-400/30 text-xs font-bold shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
              title="กลับสู่หน้าหลัก"
            >
              <Home className="w-3.5 h-3.5 text-sky-400" />
              <span>🏠 หน้าหลัก</span>
            </button>
          )}

          {/* Active Timer preview in game */}
          {activeTab === 'game' && gameDifficulty === 'time_attack' && (
            <div className={`px-2.5 sm:px-3 py-1 rounded-xl border flex items-center gap-1 text-xs font-bold font-mono tabular-nums ${
              timeLeft <= 20
                ? 'bg-rose-500/20 border-rose-400/60 text-rose-300 animate-pulse'
                : 'bg-black/40 border-white/10 text-amber-300'
            }`}>
              <span>⏱️ {formatGameTime(timeLeft)}</span>
            </div>
          )}

          {/* Active Score Preview when in game */}
          {activeTab === 'game' && (
            <div className="bg-black/40 border border-white/10 px-2.5 sm:px-3 py-1 rounded-xl flex items-center gap-1.5">
              <span className="text-slate-400 text-xs hidden sm:inline">คะแนน:</span>
              <span className="font-bold text-sm sm:text-base text-amber-300 tabular-nums">
                {score.toLocaleString()}
              </span>
            </div>
          )}

          {/* Start New Game Button (Directly requested: "เพิ่มปุ่มเริ่มเกมใหม่ด้วย") */}
          {activeTab === 'game' && (
            <button
              type="button"
              onClick={onRestartGame}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 border border-sky-400/40"
              title="เริ่มเล่นเกมรอบใหม่ รีเซ็ตคะแนนและเวลาทันที"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>🔄 เริ่มเกมใหม่</span>
            </button>
          )}

          {/* End Game Button (Directly requested: "กดจบเกมได้") */}
          {activeTab === 'game' && onEndGame && (
            <button
              type="button"
              onClick={onEndGame}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-1 border border-rose-400/40"
              title="กดจบเกมและดูคะแนนสรุปทันที"
            >
              <span>🏁 จบเกม</span>
            </button>
          )}

          {/* Quick Sound Unmute & Test Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.forceEnableAndPlay();
            }}
            className="hidden sm:flex px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold items-center gap-1 cursor-pointer transition-transform active:scale-95 shadow-sm"
            title="คลิกเพื่อเปิดเสียงเพลงและทดสอบเสียงทันที"
          >
            <span>🔊 เปิดเสียงดนตรี</span>
          </button>

          {/* Rules Button */}
          <button
            type="button"
            onClick={onOpenRules}
            className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-400/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="ดูกฎกติกาการเล่นอย่างละเอียด"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">กฎกติกา</span>
          </button>

          {/* Thai Voice TTS Toggle */}
          <button
            type="button"
            onClick={onToggleVoice}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              isVoiceEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                : 'bg-slate-800 text-slate-400 border-white/10 hover:text-white'
            }`}
            title={isVoiceEnabled ? 'ปิดเสียงพูดภาษาไทย' : 'เปิดเสียงพูดภาษาไทย'}
            aria-label="เสียงพูดภาษาไทย"
          >
            <span>🗣️</span>
            <span className="hidden lg:inline">{isVoiceEnabled ? 'เสียงพูด: เปิด' : 'เสียงพูด: ปิด'}</span>
          </button>

          {/* Background Music BGM Toggle */}
          <button
            type="button"
            onClick={onToggleBGM}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isBgmEnabled && !isMuted
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                : 'bg-slate-800 text-slate-400 border-white/10 hover:text-white'
            }`}
            title={isBgmEnabled && !isMuted ? 'ปิดเพลงประกอบ' : 'เปิดเพลงประกอบ'}
            aria-label="เพลงประกอบ"
          >
            <Music className="w-4 h-4" />
            <span className="hidden lg:inline">{isBgmEnabled && !isMuted ? 'เพลง: เปิด' : 'เพลง: ปิด'}</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs transition-colors cursor-pointer"
            title={isMuted ? 'เปิดเสียงเอฟเฟกต์' : 'ปิดเสียงเอฟเฟกต์'}
            aria-label="เสียงเอฟเฟกต์"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs transition-colors cursor-pointer"
            title={isFullscreen ? 'ออกจากโหมดเต็มหน้าจอ' : 'เปิดโหมดเต็มหน้าจอ'}
            aria-label="เต็มหน้าจอ"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-amber-300" /> : <Maximize className="w-4 h-4 text-sky-300" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Tab Bar */}
      <div className="md:hidden flex border-t border-white/10 bg-slate-950/80 px-2 py-1 justify-around text-xs">
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex-1 py-1.5 text-center font-medium rounded-lg ${
            activeTab === 'home' ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold' : 'text-slate-400'
          }`}
        >
          🏠 หน้าหลัก
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('game')}
          className={`flex-1 py-1.5 text-center font-medium rounded-lg ${
            activeTab === 'game' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400'
          }`}
        >
          🎣 เกมตกปลา
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('learn')}
          className={`flex-1 py-1.5 text-center font-medium rounded-lg ${
            activeTab === 'learn' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          📖 เรียนรู้
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('quiz')}
          className={`flex-1 py-1.5 text-center font-medium rounded-lg ${
            activeTab === 'quiz' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          📝 ข้อสอบ 30 ข้อ
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('leaderboard')}
          className={`flex-1 py-1.5 text-center font-medium rounded-lg ${
            activeTab === 'leaderboard' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'
          }`}
        >
          🏆 ชาร์จอันดับ
        </button>
      </div>

      {/* Sub-bar for Game Mode and Difficulty (when on 'game' tab) */}
      {activeTab === 'game' && (
        <div className="bg-slate-950/90 border-t border-white/5 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-slate-400 text-[11px] shrink-0">หมวดหมู่:</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-200 font-bold text-[11px]">
              <span>👑 คำบุรุษสรรพนาม ๓ บุรุษครบเซ็ต (๑ ผู้พูด, ๒ ผู้ฟัง, ๓ ผู้ถูกกล่าวถึง)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] shrink-0">โหมดการเล่น:</span>
            <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => onSwitchDifficulty('time_attack')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  gameDifficulty === 'time_attack'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⏱️ จับเวลา 3 นาที</span>
                <span className={`px-1.5 py-0.2 rounded font-mono ${timeLeft <= 20 ? 'bg-rose-500 text-white animate-pulse' : 'bg-black/30'}`}>
                  {formatGameTime(timeLeft)}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onSwitchDifficulty('practice')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  gameDifficulty === 'practice'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🌿 ฝึกซ้อมไม่จำกัดเวลา
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
