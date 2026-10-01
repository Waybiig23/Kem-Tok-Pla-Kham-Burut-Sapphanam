/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent leaderboard data file
const DATA_FILE = path.resolve(process.cwd(), 'leaderboard_data.json');

interface ScoreRecord {
  id: string;
  playerName: string;
  avatar: string;
  score: number;
  fishCaught: number;
  correctCount: number;
  wrongCount: number;
  maxCombo: number;
  accuracy: number;
  gameMode: string;
  difficulty: string;
  date: string;
  rankTitle: string;
  type?: 'fishing' | 'quiz';
}

const DEFAULT_GLOBAL_LEADERBOARD: ScoreRecord[] = [];

function loadRecords(): ScoreRecord[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading leaderboard file:', err);
  }
  return DEFAULT_GLOBAL_LEADERBOARD;
}

function saveRecords(records: ScoreRecord[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing leaderboard file:', err);
  }
}

// In-memory cache
let globalRecords: ScoreRecord[] = loadRecords();

// GET /api/leaderboard - Real global score records
app.get('/api/leaderboard', (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: globalRecords,
    credit: 'Powered by ครูเวย์บิ๊ก',
  });
});

// POST /api/leaderboard - Save score from any player worldwide
app.post('/api/leaderboard', (req: Request, res: Response) => {
  const newEntry = req.body;
  if (!newEntry || !newEntry.playerName) {
    return res.status(400).json({ error: 'Invalid score entry' });
  }

  const scoreNum = Number(newEntry.score) || 0;
  const caughtNum = Number(newEntry.fishCaught) || 0;
  const correctNum = Number(newEntry.correctCount) || 0;

  // Don't save empty runs where no fishing or quiz actually occurred
  if (scoreNum === 0 && caughtNum === 0 && correctNum === 0) {
    return res.json({ status: 'ignored', totalRecords: globalRecords.length });
  }

  const record: ScoreRecord = {
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    playerName: String(newEntry.playerName).trim(),
    avatar: newEntry.avatar || '🧑‍🌾',
    score: scoreNum,
    fishCaught: caughtNum,
    correctCount: correctNum,
    wrongCount: Number(newEntry.wrongCount) || 0,
    maxCombo: Number(newEntry.maxCombo) || 0,
    accuracy: Number(newEntry.accuracy) || 0,
    gameMode: newEntry.gameMode || 'three_persons',
    difficulty: newEntry.difficulty || 'time_attack',
    date: newEntry.date || new Date().toLocaleDateString('th-TH'),
    rankTitle: newEntry.rankTitle || 'นักตกปลา',
    type: newEntry.type || (String(newEntry.playerName).includes('สอบ') ? 'quiz' : 'fishing'),
  };

  globalRecords = [record, ...globalRecords]
    .sort((a, b) => b.score - a.score || b.accuracy - a.accuracy)
    .slice(0, 100); // Keep top 100 worldwide

  saveRecords(globalRecords);

  res.json({
    status: 'success',
    record,
    totalRecords: globalRecords.length,
  });
});

// POST /api/leaderboard/clear - Requires passcode 237280
app.post('/api/leaderboard/clear', (req: Request, res: Response) => {
  const { passcode } = req.body;
  if (passcode !== '237280') {
    return res.status(403).json({
      status: 'error',
      message: 'รหัสผ่านไม่ถูกต้อง',
    });
  }

  globalRecords = [];
  saveRecords(globalRecords);

  res.json({
    status: 'success',
    message: 'ล้างข้อมูลคะแนนทั่วโลกเรียบร้อยแล้ว',
  });
});

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT} (Powered by ครูเวย์บิ๊ก)`);
  });
}

bootstrap();
