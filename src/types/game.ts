/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PronounPerson = 1 | 2 | 3;

export type WordCategory = 'common' | 'polite' | 'formal' | 'informal' | 'monk' | 'royal';

export interface PronounWord {
  id: string;
  word: string;
  person: PronounPerson;
  category: WordCategory;
  categoryLabel: string;
  description: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type FishColor = 'orange' | 'cyan' | 'gold' | 'emerald' | 'purple' | 'pink' | 'rainbow';

export type CreatureType = 'fish' | 'whale' | 'shark' | 'dinosaur' | 'stingray';

export interface FishItem {
  id: string;
  wordItem: PronounWord;
  x: number; // percentage 0 - 100
  y: number; // percentage 25 - 85 (under water)
  speed: number;
  direction: 'left' | 'right';
  colorTheme: FishColor;
  creatureType?: CreatureType;
  scale: number;
  isCaught?: boolean;
  isSpecial?: boolean;
  bonusType?: 'time' | 'double_score';
}

export type GameMode = 'three_persons';

export type GameDifficulty = 'time_attack' | 'practice';

export interface ScoreRecord {
  id: string;
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
  date: string;
  rankTitle: string;
  type?: 'fishing' | 'quiz';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface QuizResultRecord {
  id: string;
  playerName: string;
  avatar: string;
  score: number; // e.g. 28 / 30
  totalQuestions: number; // 30
  percentage: number;
  timeSpentSeconds: number;
  date: string;
  rankTitle: string;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  isCombo?: boolean;
}

export type ActiveTab = 'home' | 'game' | 'learn' | 'quiz' | 'leaderboard';
