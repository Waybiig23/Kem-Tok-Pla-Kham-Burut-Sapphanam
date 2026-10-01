/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { soundManager } from '../utils/sound';
import { speechManager } from '../utils/speech';
import { QuizQuestion, ScoreRecord } from '../types/game';
import { saveScoreRecord, getStoredPlayerName, getStoredAvatar } from '../utils/leaderboard';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Copy,
  Check,
  Timer,
  Send,
  AlertTriangle,
  Award,
  Volume2,
  Home,
} from 'lucide-react';

interface QuizPageProps {
  onPlayGame: () => void;
  onOpenLeaderboard: () => void;
  onGoHome?: () => void;
}

const QUIZ_TIME_LIMIT_SECONDS = 20 * 60; // 20 minutes (1200 seconds)

export const QuizPage: React.FC<QuizPageProps> = ({ onPlayGame, onOpenLeaderboard, onGoHome }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(QUIZ_TIME_LIMIT_SECONDS);
  const [copied, setCopied] = useState<boolean>(false);
  const [latestRecord, setLatestRecord] = useState<ScoreRecord | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const [finishReason, setFinishReason] = useState<'normal' | 'all_done' | 'timeout'>('normal');

  const isSubmittedRef = useRef<boolean>(false);
  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = QUIZ_QUESTIONS.filter((q) => selectedAnswers[q.id] === q.correctIndex).length;

  // 20-minute countdown timer
  useEffect(() => {
    if (isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted]);

  // When timer hits 0: Auto submit
  useEffect(() => {
    if (timeLeft === 0 && !isCompleted && !isSubmittedRef.current) {
      handleConfirmSubmit('timeout');
    }
  }, [timeLeft, isCompleted]);

  // Trigger Finish and Save
  const handleConfirmSubmit = (reason: 'normal' | 'all_done' | 'timeout' = 'normal') => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;

    setShowSubmitModal(false);
    setIsCompleted(true);
    setFinishReason(reason);
    soundManager.playFanfare();

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }

    // 10 points per correct question (30 questions = 300 pts max)
    const scoreVal = correctCount * 10;
    const playerName = getStoredPlayerName() || 'นักเรียนวิชาภาษาไทย';
    const avatar = getStoredAvatar() || '🧑‍🎓';
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    const rec = saveScoreRecord({
      playerName: `${playerName} (สอบ 30 ข้อ)`,
      avatar,
      score: scoreVal,
      fishCaught: correctCount,
      correctCount,
      wrongCount: totalQuestions - correctCount,
      maxCombo: correctCount,
      accuracy,
      gameMode: 'three_persons',
      difficulty: 'practice',
      type: 'quiz',
    });

    setLatestRecord(rec);
    speechManager.speak(`ส่งข้อสอบเรียบร้อยแล้วค่ะ คุณได้ ${scoreVal} คะแนน ตอบถูก ${correctCount} ข้อค่ะ`);

    const msg =
      reason === 'timeout'
        ? `⏰ หมดเวลา 20 นาที! บันทึกคะแนนสำเร็จ: ${scoreVal} แต้ม (ตอบถูก ${correctCount}/${totalQuestions} ข้อ)`
        : `🎉 ทำข้อสอบเสร็จสิ้น! บันทึกคะแนนสำเร็จ: ${scoreVal} แต้ม (ตอบถูก ${correctCount}/${totalQuestions} ข้อ)`;

    setToastNotification(msg);
    setTimeout(() => {
      setToastNotification(null);
    }, 6000);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswerRevealed[currentQ.id]) return; // already answered

    soundManager.unlock();
    soundManager.playOptionClick();
    const isCorrect = optionIndex === currentQ.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect(1);
      speechManager.speakCorrect();
    } else {
      soundManager.playWrong();
      speechManager.speakWrong();
    }

    const updatedSelected = { ...selectedAnswers, [currentQ.id]: optionIndex };
    setSelectedAnswers(updatedSelected);
    setIsAnswerRevealed((prev) => ({ ...prev, [currentQ.id]: true }));

    // Check if user just completed all 30 questions
    const newlyAnsweredCount = Object.keys(updatedSelected).length;
    if (newlyAnsweredCount === totalQuestions) {
      // Prompt user to submit or review
      setTimeout(() => {
        setFinishReason('all_done');
        setShowSubmitModal(true);
      }, 500);
    }
  };

  const handleResetQuiz = () => {
    isSubmittedRef.current = false;
    setSelectedAnswers({});
    setIsAnswerRevealed({});
    setCurrentIndex(0);
    setIsCompleted(false);
    setTimeLeft(QUIZ_TIME_LIMIT_SECONDS);
    setLatestRecord(null);
    setShowSubmitModal(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const timeUsedSeconds = QUIZ_TIME_LIMIT_SECONDS - timeLeft;

  const handleCopyScore = () => {
    const text = `📝 [ผลสอบคำบุรุษสรรพนาม 30 ข้อ]\nผู้สอบ: ${getStoredPlayerName() || 'นักเรียน'}\nคะแนนที่ได้: ${correctCount * 10} / 300 คะแนน (ตอบถูก ${correctCount} / ${totalQuestions} ข้อ - ${Math.round((correctCount / totalQuestions) * 100)}%)\nเวลาที่ใช้: ${formatTime(timeUsedSeconds)} จาก 20 นาที\nวันที่: ${new Date().toLocaleDateString('th-TH')}\nPowered by ครูเวย์บิ๊ก`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fadeIn text-slate-100">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="rounded-2xl bg-slate-900 border border-amber-500/30 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white">
                แบบทดสอบคำบุรุษสรรพนาม ๓ บุรุษ (30 ข้อ)
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                จับเวลา 20 นาที
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ข้อละ 10 คะแนน (เต็ม 300 คะแนน) · Powered by ครูเวย์บิ๊ก
            </p>
          </div>
        </div>

        {/* 20-minute countdown timer & status badge */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {onGoHome && (
            <button
              type="button"
              onClick={onGoHome}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-200 border border-sky-400/30 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="กลับสู่หน้าหลัก"
            >
              <Home className="w-3.5 h-3.5 text-sky-400" />
              <span>🏠 หน้าหลัก</span>
            </button>
          )}

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold font-mono tabular-nums ${
              timeLeft <= 180
                ? 'bg-rose-500/20 border-rose-400 text-rose-300 animate-pulse'
                : 'bg-black/50 border-white/10 text-amber-300'
            }`}
          >
            <Timer className="w-4 h-4 text-amber-400" />
            <span>เวลาเหลือ: {formatTime(timeLeft)}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-bold tabular-nums">
            ตอบแล้ว {answeredCount}/{totalQuestions}
          </div>

          {!isCompleted && (
            <button
              type="button"
              onClick={() => {
                setFinishReason('normal');
                setShowSubmitModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ส่งข้อสอบ</span>
            </button>
          )}
        </div>
      </div>

      {/* Finished Summary View */}
      {isCompleted ? (
        <div className="rounded-3xl bg-slate-900 border-2 border-amber-400/40 p-6 md:p-8 text-center space-y-6 shadow-2xl animate-scaleUp">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300">
            <Trophy className="w-12 h-12 animate-bounce" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {finishReason === 'timeout'
                ? '⏰ หมดเวลา 20 นาที! บันทึกคะแนนเรียบร้อยแล้ว'
                : '🎉 ส่งแบบทดสอบเรียบร้อยแล้ว!'}
            </h2>
            <p className="text-sm text-sky-200/90">
              บันทึกคะแนน {correctCount * 10} แต้ม ลงในชาร์จอันดับเกียรติยศทั่วโลกเรียบร้อยแล้ว
            </p>
          </div>

          {/* Big Score Box */}
          <div className="max-w-md mx-auto rounded-2xl bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-emerald-500/20 border border-amber-400/30 p-5">
            <span className="text-xs font-semibold text-slate-300 uppercase">
              คะแนนสอบที่ได้
            </span>
            <div className="text-5xl font-black text-amber-300 my-1 tabular-nums">
              {correctCount * 10} <span className="text-2xl font-normal text-slate-400">/ 300 คะแนน</span>
            </div>
            <div className="text-sm font-bold text-emerald-400">
              ตอบถูก {correctCount} จาก {totalQuestions} ข้อ ({Math.round((correctCount / totalQuestions) * 100)}%)
            </div>
            <div className="text-xs text-slate-400 mt-1">
              ใช้เวลาสอบ: {formatTime(timeUsedSeconds)} จาก 20 นาที
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center max-w-md mx-auto pt-2">
            <button
              type="button"
              onClick={handleResetQuiz}
              className="flex-1 min-w-[140px] py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs md:text-sm border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ทำใหม่อีกครั้ง</span>
            </button>

            <button
              type="button"
              onClick={handleCopyScore}
              className="flex-1 min-w-[140px] py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm border border-white/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>คัดลอกผลสอบ</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>ดูชาร์จอันดับเกียรติยศ (Leaderboard)</span>
            </button>

            <button
              type="button"
              onClick={onPlayGame}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🎣 กลับไปเล่นเกมตกปลา ๓ บุรุษ</span>
            </button>

            {onGoHome && (
              <button
                type="button"
                onClick={onGoHome}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-200 border border-sky-400/30 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 text-sky-400" />
                <span>🏠 กลับสู่หน้าหลัก</span>
              </button>
            )}
          </div>

          {/* Review Question List */}
          <div className="pt-6 border-t border-white/10 text-left space-y-4">
            <h3 className="text-base font-bold text-white">
              เฉลยละเอียดและคำอธิบายทั้ง 30 ข้อ:
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-rose-950/40 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 font-bold text-sm text-white">
                      <span>ข้อ {idx + 1}. {q.question}</span>
                      {isCorrect ? (
                        <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs">
                          ✓ ถูกต้อง (+10 แต้ม)
                        </span>
                      ) : (
                        <span className="shrink-0 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs">
                          ✗ ตอบผิด (0 แต้ม)
                        </span>
                      )}
                    </div>

                    <div className="text-slate-300">
                      คำตอบที่ถูกต้อง: <strong className="text-emerald-300">{q.options[q.correctIndex]}</strong>
                      {userAns !== undefined && !isCorrect && (
                        <span className="text-rose-300 ml-2">
                          (คุณตอบ: {q.options[userAns]})
                        </span>
                      )}
                      {userAns === undefined && (
                        <span className="text-amber-300 ml-2">(ไม่ได้ตอบข้อนี้)</span>
                      )}
                    </div>

                    <div className="text-slate-400 bg-black/30 p-2 rounded-lg italic">
                      💡 คำอธิบาย: {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Active Question Card */
        <div className="rounded-3xl bg-slate-900 border border-white/10 p-5 sm:p-7 shadow-2xl space-y-6">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>ข้อที่ {currentIndex + 1} จาก {totalQuestions}</span>
              <span>หมวด: {currentQ.category}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              ข้อ {currentIndex + 1}. {currentQ.question}
            </h2>
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, optIndex) => {
              const isRevealed = isAnswerRevealed[currentQ.id];
              const isChosen = selectedAnswers[currentQ.id] === optIndex;
              const isRight = optIndex === currentQ.correctIndex;

              let btnStyle = 'bg-slate-800/80 border-white/10 hover:border-amber-400/50 hover:bg-slate-800';
              if (isRevealed) {
                if (isRight) {
                  btnStyle = 'bg-emerald-600/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/50';
                } else if (isChosen && !isRight) {
                  btnStyle = 'bg-rose-600/30 border-rose-400 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-800/40 border-white/5 opacity-50';
                }
              }

              const letters = ['ก', 'ข', 'ค', 'ง'];

              return (
                <button
                  key={optIndex}
                  type="button"
                  onClick={() => handleSelectOption(optIndex)}
                  className={`p-4 rounded-2xl border text-left font-medium text-sm transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center text-xs font-bold text-amber-300 shrink-0">
                      {letters[optIndex]}
                    </span>
                    <span className="text-white">{opt}</span>
                  </div>

                  {isRevealed && isRight && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isRevealed && isChosen && !isRight && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Reveals after picking option) */}
          {isAnswerRevealed[currentQ.id] && (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <span>💡 คำอธิบายเฉลย:</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ข้อย้อนหลัง</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFinishReason('normal');
                  setShowSubmitModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>ส่งข้อสอบ</span>
              </button>

              {currentIndex < totalQuestions - 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs md:text-sm shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>ข้อถัดไป</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Question Jump 30 Number Grid */}
          <div className="pt-4 border-t border-white/10">
            <div className="text-[11px] font-semibold text-slate-400 mb-2">
              เลือกข้ามไปยังข้อที่ต้องการ (1-30):
            </div>
            <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const isCur = idx === currentIndex;
                const isAns = isAnswerRevealed[q.id];
                const isRight = selectedAnswers[q.id] === q.correctIndex;

                let badge = 'bg-white/5 text-slate-400 hover:bg-white/10';
                if (isAns) {
                  badge = isRight ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' : 'bg-rose-500/30 text-rose-300 border border-rose-500/50';
                }
                if (isCur) {
                  badge += ' ring-2 ring-amber-400 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-7 rounded-lg text-[11px] flex items-center justify-center transition-colors cursor-pointer ${badge}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal when finishing or submitting */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-400/40 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-white p-6 space-y-5 animate-scaleUp">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {finishReason === 'all_done' ? (
                  <Award className="w-10 h-10 animate-bounce" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-amber-400" />
                )}
              </div>

              <h3 className="text-xl font-bold text-white">
                {finishReason === 'all_done'
                  ? '🎉 ทำข้อสอบครบ 30 ข้อแล้ว!'
                  : 'ยืนยันการส่งแบบทดสอบ'}
              </h3>
              <p className="text-xs text-slate-300">
                คุณตอบข้อสอบไปแล้ว{' '}
                <strong className="text-amber-300 font-bold">{answeredCount}</strong> จาก{' '}
                <strong className="text-white font-bold">{totalQuestions}</strong> ข้อ
              </p>
            </div>

            <div className="bg-slate-800/80 border border-white/10 p-3.5 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>เวลาที่ใช้:</span>
                <span className="font-mono text-white font-bold">{formatTime(timeUsedSeconds)} / 20 นาที</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>คะแนนสะสมที่คาดหวัง:</span>
                <span className="text-amber-300 font-bold">{correctCount * 10} / 300 คะแนน</span>
              </div>
              <div className="text-[11px] text-sky-200">
                * คะแนนจะถูกบันทึกลงในตารางคะแนนเกียรติยศทันที
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
              >
                ตรวจทานคำตอบก่อน
              </button>
              <button
                type="button"
                onClick={() => handleConfirmSubmit(finishReason)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>ยืนยันส่งข้อสอบ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
