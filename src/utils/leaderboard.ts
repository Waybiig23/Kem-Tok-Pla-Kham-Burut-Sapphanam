/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScoreRecord, GameMode, GameDifficulty } from '../types/game';
import { db } from '../firebase';
import { collection, doc, setDoc, getDocs, query, orderBy, limit, deleteDoc } from 'firebase/firestore';

const STORAGE_KEY = 'thai_pronoun_fishing_leaderboard_v2';
const PLAYER_NAME_KEY = 'thai_pronoun_player_name';
const PLAYER_AVATAR_KEY = 'thai_pronoun_player_avatar';

export const AVATAR_OPTIONS = [
  '🧑‍🌾', '👧', '👦', '🧑‍🎓', '⛵', '🐬', '🐙', '🐢', '🦀', '⭐', '🦈', '🐠'
];

export function getRankTitle(score: number, accuracy: number): string {
  if (score >= 250 && accuracy >= 90) return '👑 ปรมาจารย์คำบุรุษสรรพนาม (Grand Master)';
  if (score >= 180 && accuracy >= 85) return '🦈 พรานเบ็ดแห่งมหาสมุทร (Ocean Hunter)';
  if (score >= 120 && accuracy >= 80) return '🐬 ผู้เชี่ยวชาญไวยากรณ์ (Grammar Expert)';
  if (score >= 70) return '🐟 นักตกปลาผู้ชำนาญ (Skilled Angler)';
  if (score >= 30) return '🐠 นักตกปลารุ่นเยาว์ (Junior Fisher)';
  return '🌱 นักตกปลามือใหม่ (Novice Fisher)';
}

// Only real records from real gameplay sessions
const DEFAULT_GLOBAL_RECORDS: ScoreRecord[] = [];

export function getStoredPlayerName(): string {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredPlayerName(name: string): void {
  try {
    localStorage.setItem(PLAYER_NAME_KEY, name.trim());
  } catch {
    // Ignore
  }
}

export function getStoredAvatar(): string {
  try {
    return localStorage.getItem(PLAYER_AVATAR_KEY) || '🧑‍🌾';
  } catch {
    return '🧑‍🌾';
  }
}

export function setStoredAvatar(avatar: string): void {
  try {
    localStorage.setItem(PLAYER_AVATAR_KEY, avatar);
  } catch {
    // Ignore
  }
}

export function getLeaderboard(): ScoreRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_GLOBAL_RECORDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_GLOBAL_RECORDS;
  } catch {
    return DEFAULT_GLOBAL_RECORDS;
  }
}

// Fetch live worldwide leaderboard from Firebase Firestore (with fallback)
export async function syncWorldwideLeaderboard(): Promise<ScoreRecord[]> {
  try {
    const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    const firestoreRecords: ScoreRecord[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as ScoreRecord;
      firestoreRecords.push(data);
    });

    if (firestoreRecords.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(firestoreRecords));
      return firestoreRecords;
    }
  } catch (firestoreErr) {
    console.warn('Firestore fetch failed, checking server API:', firestoreErr);
  }

  // Secondary fallback to server.ts endpoint
  try {
    const res = await fetch('/api/leaderboard');
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch (err) {
    console.warn('API sync fallback notice:', err);
  }

  return getLeaderboard();
}

export function saveScoreRecord(entry: {
  playerName: string;
  avatar: string;
  score: number;
  fishCaught: number;
  correctCount: number;
  wrongCount: number;
  maxCombo: number;
  accuracy: number;
  gameMode: GameMode;
  difficulty: GameDifficulty;
  type?: 'fishing' | 'quiz';
}): ScoreRecord {
  const current = getLeaderboard();
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  const rankTitle = getRankTitle(entry.score, entry.accuracy);

  const newRecord: ScoreRecord = {
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ...entry,
    type: entry.type || (entry.playerName.includes('สอบ') ? 'quiz' : 'fishing'),
    date: dateStr,
    rankTitle,
  };

  const updated = [newRecord, ...current]
    .sort((a, b) => b.score - a.score || b.accuracy - a.accuracy)
    .slice(0, 100);

  // 1. Cache to local storage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  // 2. Persist to Firebase Firestore
  try {
    const docRef = doc(db, 'leaderboard', newRecord.id);
    setDoc(docRef, {
      ...newRecord,
      createdAt: new Date().toISOString(),
    }).catch((fsErr) => {
      console.warn('Firestore setDoc notice:', fsErr);
    });
  } catch (e) {
    console.warn('Firebase save notice:', e);
  }

  // 3. Also backup to server.ts API
  fetch('/api/leaderboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRecord),
  }).catch(() => {});

  return newRecord;
}

export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// Validate passcode 237280 and clear worldwide Firestore + local scores
export async function verifyAndClearLeaderboard(passcode: string): Promise<{ success: boolean; message: string }> {
  if (passcode.trim() !== '237280') {
    return {
      success: false,
      message: 'รหัสผ่านไม่ถูกต้อง! กรุณาลองใหม่อีกครั้ง',
    };
  }

  // Clear local
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }

  // Clear Firestore
  try {
    const snapshot = await getDocs(collection(db, 'leaderboard'));
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, 'leaderboard', docSnap.id)));
    await Promise.all(deletePromises);
  } catch (fsErr) {
    console.warn('Firestore delete notice:', fsErr);
  }

  // Clear on backend
  try {
    await fetch('/api/leaderboard/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: '237280' }),
    });
  } catch (err) {
    console.warn('Backend clear failed:', err);
  }

  return {
    success: true,
    message: 'ล้างข้อมูลคะแนนในระบบคลาวด์ Firebase และเครื่องเรียบร้อยแล้ว',
  };
}
