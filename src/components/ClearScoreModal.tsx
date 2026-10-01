/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { verifyAndClearLeaderboard } from '../utils/leaderboard';
import { soundManager } from '../utils/sound';

interface ClearScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ClearScoreModal: React.FC<ClearScoreModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg('กรุณากรอกรหัสผ่านยืนยัน');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const res = await verifyAndClearLeaderboard(passcode);
    setIsLoading(false);

    if (res.success) {
      soundManager.playCorrect(2);
      setPasscode('');
      onSuccess();
      onClose();
    } else {
      soundManager.playWrong();
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden text-white animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                ยืนยันการล้างคะแนนระบบ
              </h3>
              <p className="text-[11px] text-slate-400">
                สำหรับผู้ดูแลระบบหรือคุณครู
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label
              htmlFor="passcodeInput"
              className="block text-xs font-semibold text-slate-300 mb-1.5"
            >
              ใส่รหัสผ่านเพื่อล้างข้อมูล:
            </label>
            <input
              id="passcodeInput"
              type="password"
              autoFocus
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/20 rounded-xl text-white text-center text-lg tracking-widest placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
            />

            {errorMsg && (
              <div className="flex items-center gap-1.5 mt-2 text-rose-400 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLoading ? 'กำลังตรวจสอบ...' : 'ยืนยันการล้าง'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
