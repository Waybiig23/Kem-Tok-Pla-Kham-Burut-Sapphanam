/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PronounPerson,
  FishItem,
  CreatureType,
  GameMode,
  GameDifficulty,
  ScoreRecord,
  FloatingText,
  FishColor,
  PronounWord,
  ActiveTab,
} from './types/game';
import { getWordsForMode } from './data/pronounData';
import { soundManager } from './utils/sound';
import {
  getStoredPlayerName,
  setStoredPlayerName,
  getStoredAvatar,
  setStoredAvatar,
  getLeaderboard,
  saveScoreRecord,
  clearLeaderboard,
  syncWorldwideLeaderboard,
} from './utils/leaderboard';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { Baskets } from './components/Baskets';
import { FishingOcean } from './components/FishingOcean';
import { LearnPage } from './components/LearnPage';
import { QuizPage } from './components/QuizPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { NameModal } from './components/NameModal';
import { GameOverModal } from './components/GameOverModal';
import { EducationalToast } from './components/EducationalToast';
import { StartRulesModal } from './components/StartRulesModal';
import { speechManager } from './utils/speech';

const INITIAL_TIME = 180; // 3 minutes (180 seconds) as requested
const MAX_FISH_ON_SCREEN = 6;
const FISH_COLORS: FishColor[] = ['orange', 'cyan', 'gold', 'emerald', 'purple', 'pink', 'rainbow'];

export default function App() {
  // Navigation State: 'home' | 'game' | 'learn' | 'quiz' | 'leaderboard'
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Player state
  const [playerName, setPlayerName] = useState<string>(() => getStoredPlayerName() || 'กัปตันปลา');
  const [playerAvatar, setPlayerAvatar] = useState<string>(() => getStoredAvatar() || '🧑‍🌾');
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);

  // Initial Onboarding & Rules Modal (requested: "ให้เปิดเกมมาใส่ชื่อก่อนกดเล่นเกมสิ ไม่ทันอ่านกฎอะไรเลย")
  const [hasStartedGame, setHasStartedGame] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(true); // Opens on first load!

  // Game configuration - defaults to 'three_persons' (สรรพนามมี 3 บุรุษ)
  const [gameMode, setGameMode] = useState<GameMode>('three_persons');
  const [gameDifficulty, setGameDifficulty] = useState<GameDifficulty>('time_attack');
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.isMuted);
  const [isBgmEnabled, setIsBgmEnabled] = useState<boolean>(soundManager.isBgmEnabled);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(speechManager.isEnabled);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if ((elem as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen) {
        (elem as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as unknown as { webkitExitFullscreen: () => void }).webkitExitFullscreen) {
        (document as unknown as { webkitExitFullscreen: () => void }).webkitExitFullscreen();
      }
    }
  }, []);

  // Gameplay state
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [basketCounts, setBasketCounts] = useState<Record<PronounPerson, number>>({ 1: 0, 2: 0, 3: 0 });
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_TIME);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [latestRecord, setLatestRecord] = useState<ScoreRecord | null>(null);

  // REFS TO PREVENT STALE CLOSURES IN TIMER & GAMEOVER
  const isGameOverRef = useRef<boolean>(false);
  const scoreRef = useRef<number>(0);
  const correctCountRef = useRef<number>(0);
  const wrongCountRef = useRef<number>(0);
  const maxComboRef = useRef<number>(0);
  const playerNameRef = useRef<string>(playerName);
  const playerAvatarRef = useRef<string>(playerAvatar);
  const gameModeRef = useRef<GameMode>(gameMode);
  const gameDifficultyRef = useRef<GameDifficulty>(gameDifficulty);

  useEffect(() => {
    playerNameRef.current = playerName;
    playerAvatarRef.current = playerAvatar;
    gameModeRef.current = gameMode;
    gameDifficultyRef.current = gameDifficulty;
  }, [playerName, playerAvatar, gameMode, gameDifficulty]);

  // Active fishes and interactions
  const [fishes, setFishes] = useState<FishItem[]>([]);
  const [selectedFish, setSelectedFish] = useState<FishItem | null>(null);
  const [escapeTimeLeft, setEscapeTimeLeft] = useState<number>(3.0);
  const [wobbleBasket, setWobbleBasket] = useState<PronounPerson | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Educational Toast
  const [toastInfo, setToastInfo] = useState<{
    word: PronounWord | null;
    isCorrect: boolean;
    chosen: number | null;
  }>({ word: null, isCorrect: true, chosen: null });

  // Leaderboard data
  const [leaderboardRecords, setLeaderboardRecords] = useState<ScoreRecord[]>(() => getLeaderboard());

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const toastTimeoutRef = useRef<number | null>(null);

  // Sync leaderboard on mount and unlock audio on interaction
  useEffect(() => {
    syncWorldwideLeaderboard().then((data) => {
      if (data && data.length > 0) {
        setLeaderboardRecords(data);
      }
    });

    const handleUserInteraction = () => {
      soundManager.unlock();
    };

    window.addEventListener('pointerdown', handleUserInteraction, { capture: true });
    window.addEventListener('click', handleUserInteraction, { capture: true });
    window.addEventListener('keydown', handleUserInteraction, { capture: true });
    window.addEventListener('touchstart', handleUserInteraction, { capture: true });

    return () => {
      window.removeEventListener('pointerdown', handleUserInteraction, { capture: true });
      window.removeEventListener('click', handleUserInteraction, { capture: true });
      window.removeEventListener('keydown', handleUserInteraction, { capture: true });
      window.removeEventListener('touchstart', handleUserInteraction, { capture: true });
    };
  }, []);

  // Helper to generate a single random fish
  const createRandomFish = useCallback(
    (existingFishes: FishItem[], initialSpawn: boolean = false): FishItem => {
      const words = getWordsForMode(gameMode);
      const wordItem = words[Math.floor(Math.random() * words.length)];
      const direction: 'left' | 'right' = Math.random() > 0.5 ? 'right' : 'left';
      const colorTheme = FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)];
      const isSpecial = Math.random() < 0.15; // 15% special fish

      let startX: number;
      if (initialSpawn) {
        startX = 10 + Math.random() * 80;
      } else {
        startX = direction === 'right' ? -8 : 108;
      }

      // Fish swim in water between y = 32% and y = 78% of the canvas
      const startY = 32 + Math.random() * 46;
      const speed = 0.04 + Math.random() * 0.045;

      // Creature distribution: Whale (20%), Shark (20%), Aquatic Dinosaur (20%), Stingray (20%), Marine Fish (20%)
      const rand = Math.random();
      let creatureType: CreatureType = 'fish';
      let scale = 0.95 + Math.random() * 0.15;

      if (rand < 0.20) {
        creatureType = 'whale';
        scale = 1.32 + Math.random() * 0.15; // majestic realistic whale
      } else if (rand < 0.40) {
        creatureType = 'shark';
        scale = 1.18 + Math.random() * 0.12; // realistic Great White shark
      } else if (rand < 0.60) {
        creatureType = 'dinosaur';
        scale = 1.25 + Math.random() * 0.15; // realistic Plesiosaur dinosaur
      } else if (rand < 0.80) {
        creatureType = 'stingray';
        scale = 1.22 + Math.random() * 0.12; // realistic stingray / manta
      } else {
        creatureType = 'fish';
        scale = 1.0 + Math.random() * 0.15;
      }

      return {
        id: `fish-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        wordItem,
        x: startX,
        y: startY,
        speed,
        direction,
        colorTheme,
        creatureType,
        scale,
        isSpecial,
      };
    },
    [gameMode]
  );

  // Spawn initial fishes on start or mode switch
  const initializeFishes = useCallback(() => {
    const newFishes: FishItem[] = [];
    for (let i = 0; i < MAX_FISH_ON_SCREEN; i++) {
      newFishes.push(createRandomFish(newFishes, true));
    }
    setFishes(newFishes);
  }, [createRandomFish]);

  // Reset Game
  const resetGame = useCallback(() => {
    soundManager.unlock();
    soundManager.playReel();
    isGameOverRef.current = false;
    scoreRef.current = 0;
    correctCountRef.current = 0;
    wrongCountRef.current = 0;
    maxComboRef.current = 0;
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setWrongCount(0);
    setBasketCounts({ 1: 0, 2: 0, 3: 0 });
    setTimeLeft(INITIAL_TIME);
    setIsGameOver(false);
    setSelectedFish(null);
    setEscapeTimeLeft(3.0);
    setFloatingTexts([
      {
        id: `restart-${Date.now()}`,
        text: '🔄 เริ่มเกมใหม่แล้ว! ลุยเลย',
        x: 50,
        y: 40,
        color: '#38bdf8',
        isCombo: true,
      },
    ]);
    setTimeout(() => {
      setFloatingTexts([]);
    }, 1500);
    initializeFishes();
  }, [initializeFishes]);

  // Initial fish spawn
  useEffect(() => {
    initializeFishes();
  }, [initializeFishes]);

  // Main game animation loop for swimming fish
  useEffect(() => {
    if (isGameOver || activeTab !== 'game') return;

    const updateFishes = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 16.66, 3);
      lastTimeRef.current = time;

      setFishes((prev) => {
        const updated = prev.map((fish) => {
          const isTarget = selectedFish?.id === fish.id;
          const currentSpeed = isTarget ? fish.speed * 0.2 : fish.speed;
          const deltaX = fish.direction === 'right' ? currentSpeed * dt * 1.8 : -currentSpeed * dt * 1.8;
          let newX = fish.x + deltaX;

          if (fish.direction === 'right' && newX > 115) {
            newX = -10;
          } else if (fish.direction === 'left' && newX < -15) {
            newX = 110;
          }

          return {
            ...fish,
            x: newX,
          };
        });

        if (updated.length < MAX_FISH_ON_SCREEN) {
          const fresh = createRandomFish(updated, false);
          return [...updated, fresh];
        }

        return updated;
      });

      animationFrameRef.current = requestAnimationFrame(updateFishes);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(updateFishes);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isGameOver, selectedFish, createRandomFish, activeTab]);

  // Trigger game over and save score (Reads from REFS so values are never stale!)
  const handleGameOver = useCallback(() => {
    if (isGameOverRef.current) return;
    isGameOverRef.current = true;
    setIsGameOver(true);
    soundManager.playFanfare();

    const finalCorrect = correctCountRef.current;
    const finalWrong = wrongCountRef.current;
    const finalScore = finalCorrect * 10; // Exactly 10 points per caught fish!
    speechManager.speakGameOver(finalScore, finalCorrect);
    const finalMaxCombo = maxComboRef.current;
    const finalPlayer = playerNameRef.current.trim() || 'กัปตันปลา';
    const accuracy = Math.round((finalCorrect / (finalCorrect + finalWrong || 1)) * 100);

    // Only save to worldwide leaderboard if the player actually fished
    if (finalCorrect > 0 || finalWrong > 0) {
      const record = saveScoreRecord({
        playerName: finalPlayer,
        avatar: playerAvatarRef.current,
        score: finalScore,
        fishCaught: finalCorrect,
        correctCount: finalCorrect,
        wrongCount: finalWrong,
        maxCombo: finalMaxCombo,
        accuracy,
        gameMode: gameModeRef.current,
        difficulty: gameDifficultyRef.current,
        type: 'fishing',
      });

      setLatestRecord(record);
      setLeaderboardRecords(getLeaderboard());
    } else {
      const dummyRecord: ScoreRecord = {
        id: `rec-${Date.now()}`,
        playerName: finalPlayer,
        avatar: playerAvatarRef.current,
        score: 0,
        fishCaught: 0,
        correctCount: 0,
        wrongCount: 0,
        maxCombo: 0,
        accuracy: 0,
        gameMode: gameModeRef.current,
        difficulty: gameDifficultyRef.current,
        date: new Date().toLocaleDateString('th-TH'),
        rankTitle: '🌱 นักตกปลามือใหม่ (Novice Fisher)',
        type: 'fishing',
      };
      setLatestRecord(dummyRecord);
    }
  }, []);

  // Timer countdown for Time Attack mode
  useEffect(() => {
    if (activeTab !== 'game' || gameDifficulty !== 'time_attack' || isGameOver || isRulesModalOpen || !hasStartedGame) return;

    if (timeLeft <= 0) {
      handleGameOver();
      return;
    }

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
  }, [activeTab, gameDifficulty, isGameOver, isRulesModalOpen, hasStartedGame, timeLeft, handleGameOver]);

  // Trigger floating visual effect
  const addFloatingText = (text: string, x: number, y: number, color: string, isCombo: boolean = false) => {
    const id = `ft-${Date.now()}-${Math.random()}`;
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color, isCombo }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  // Select/Hook fish
  const handleSelectFish = (fish: FishItem) => {
    soundManager.unlock();
    setSelectedFish(fish);
    setEscapeTimeLeft(3.0);
    speechManager.speakWord(fish.wordItem.word);
    soundManager.playReel();
    soundManager.playSplash();
  };

  // Creature struggles and escapes after 3 seconds of hesitation (requested: "ดิ้นหลุดได้ด้วยถ้ากดช้าภายใน 3 วิ")
  const handleFishEscape = useCallback(() => {
    setSelectedFish((currentFish) => {
      if (!currentFish) return null;

      const creatureLabel =
        currentFish.creatureType === 'whale'
          ? 'วาฬยักษ์'
          : currentFish.creatureType === 'shark'
          ? 'ฉลาม'
          : currentFish.creatureType === 'dinosaur'
          ? 'ไดโนเสาร์'
          : currentFish.creatureType === 'stingray'
          ? 'ปลากระเบน'
          : 'ปลา';

      soundManager.playEscape();
      speechManager.speakEscape(creatureLabel);

      addFloatingText(
        `💨 ${creatureLabel}ดิ้นหลุดไปแล้ว! (เกิน 3 วิ)`,
        currentFish.x,
        currentFish.y - 12,
        '#f43f5e',
        false
      );

      // Reset combo when creature breaks free
      setCombo(0);

      // Creature dashes away, replaced by fresh creature
      setFishes((prev) => {
        const filtered = prev.filter((f) => f.id !== currentFish.id);
        const fresh = createRandomFish(filtered, false);
        return [...filtered, fresh];
      });

      return null;
    });
    setEscapeTimeLeft(3.0);
  }, [createRandomFish]);

  // 3-second tension countdown timer when a creature is hooked
  useEffect(() => {
    if (!selectedFish || isGameOver || isRulesModalOpen) {
      setEscapeTimeLeft(3.0);
      return;
    }

    const hookStartTime = performance.now();
    setEscapeTimeLeft(3.0);

    const interval = setInterval(() => {
      const elapsed = (performance.now() - hookStartTime) / 1000;
      const remaining = Math.max(0, 3.0 - elapsed);
      setEscapeTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleFishEscape();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [selectedFish, isGameOver, isRulesModalOpen, handleFishEscape]);

  // Drop fish into specified basket
  // Requirement: "คะแนนตกไปตัวละ 10 คะแนนพอ" -> Base score is 10 points per caught fish!
  const handleDropToBasket = useCallback(
    (basketPerson: PronounPerson) => {
      if (!selectedFish) return;

      soundManager.unlock();
      const isCorrect = selectedFish.wordItem.person === basketPerson;
      const fishWord = selectedFish.wordItem;

      if (isCorrect) {
        // CORRECT: Exactly 10 points per caught fish!
        const newCorrect = correctCountRef.current + 1;
        correctCountRef.current = newCorrect;

        const newScore = newCorrect * 10;
        scoreRef.current = newScore;

        const newCombo = combo + 1;
        if (newCombo > maxComboRef.current) {
          maxComboRef.current = newCombo;
        }

        setCombo(newCombo);
        setMaxCombo(maxComboRef.current);
        setScore(newScore);
        setCorrectCount(newCorrect);
        setBasketCounts((prev) => ({
          ...prev,
          [basketPerson]: (prev[basketPerson] || 0) + 1,
        }));

        soundManager.playSplash();
        soundManager.playCorrect(newCombo);
        speechManager.speakCorrect(basketPerson);

        setWobbleBasket(basketPerson);
        setTimeout(() => setWobbleBasket(null), 500);

        addFloatingText(
          `+10 คะแนน! (รวม ${newScore})`,
          selectedFish.x,
          selectedFish.y - 10,
          '#fbbf24',
          newCombo >= 3
        );

        setToastInfo({ word: fishWord, isCorrect: true, chosen: basketPerson });

        setFishes((prev) => {
          const filtered = prev.filter((f) => f.id !== selectedFish.id);
          const fresh = createRandomFish(filtered, false);
          return [...filtered, fresh];
        });
        setSelectedFish(null);
      } else {
        // WRONG: Reset combo, increment wrong count
        const newWrong = wrongCountRef.current + 1;
        wrongCountRef.current = newWrong;

        setCombo(0);
        setWrongCount(newWrong);

        soundManager.playWrong();
        speechManager.speakWrong();

        addFloatingText(
          `ไม่ใช่จ้า (คำว่า ${fishWord.word})`,
          selectedFish.x,
          selectedFish.y - 10,
          '#f87171'
        );

        setToastInfo({ word: fishWord, isCorrect: false, chosen: basketPerson });
        setSelectedFish(null);
      }

      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = window.setTimeout(() => {
        setToastInfo({ word: null, isCorrect: true, chosen: null });
      }, 4500);
    },
    [selectedFish, combo, createRandomFish]
  );

  // Keyboard controls: 1 -> basket 1, 2 -> basket 2, 3 -> basket 3
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'game' || isNameModalOpen || isGameOver) return;

      if (e.key === '1') {
        e.preventDefault();
        handleDropToBasket(1);
      } else if (e.key === '2') {
        e.preventDefault();
        handleDropToBasket(2);
      } else if (e.key === '3') {
        e.preventDefault();
        handleDropToBasket(3);
      } else if (e.key === 'Escape') {
        setSelectedFish(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDropToBasket, isNameModalOpen, isGameOver, activeTab]);

  // Audio toggles
  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleBGM = () => {
    const bgmOn = soundManager.toggleBGM();
    setIsBgmEnabled(bgmOn);
  };

  // Save Player Name
  const handleSavePlayer = (name: string, avatar: string) => {
    setPlayerName(name);
    setPlayerAvatar(avatar);
    setStoredPlayerName(name);
    setStoredAvatar(avatar);
    setIsNameModalOpen(false);
  };

  // Clear Leaderboard
  const handleClearLeaderboard = () => {
    clearLeaderboard();
    setLeaderboardRecords([]);
  };

  const handleToggleVoice = () => {
    setIsVoiceEnabled(speechManager.toggleVoice());
  };

  const handleStartGame = (name: string, avatar: string) => {
    handleSavePlayer(name, avatar);
    setHasStartedGame(true);
    setIsRulesModalOpen(false);
    resetGame();
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 font-sans selection:bg-sky-500 selection:text-white">
      {/* 3-Zone Top Bar Navigation & HUD */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        score={score}
        combo={combo}
        timeLeft={timeLeft}
        gameDifficulty={gameDifficulty}
        gameMode={gameMode}
        playerName={playerName}
        avatar={playerAvatar}
        isMuted={isMuted}
        isBgmEnabled={isBgmEnabled}
        isFullscreen={isFullscreen}
        onToggleSound={handleToggleSound}
        onToggleBGM={handleToggleBGM}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenNameModal={() => setIsRulesModalOpen(true)}
        onRestartGame={resetGame}
        onEndGame={handleGameOver}
        onOpenRules={() => setIsRulesModalOpen(true)}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={handleToggleVoice}
        onSwitchMode={(mode) => {
          setGameMode(mode);
          resetGame();
        }}
        onSwitchDifficulty={(diff) => {
          setGameDifficulty(diff);
          resetGame();
        }}
      />

      {/* Main Content Area based on Tab */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* 0. Home Page Hub (requested: "ปุ่มกลับหน้าหลักด้วย ให้มีกดเริ่มเกม กดอ่านตำรา กดทำข้อสอบ") */}
        {activeTab === 'home' && (
          <HomePage
            playerName={playerName}
            avatar={playerAvatar}
            onOpenNameModal={() => setIsNameModalOpen(true)}
            onStartGame={() => {
              resetGame();
              setActiveTab('game');
            }}
            onOpenLessons={() => setActiveTab('learn')}
            onStartQuiz={() => setActiveTab('quiz')}
            onOpenLeaderboard={() => {
              setLeaderboardRecords(getLeaderboard());
              setActiveTab('leaderboard');
            }}
            onOpenRules={() => setIsRulesModalOpen(true)}
          />
        )}

        {/* 1. Fishing Game Tab */}
        {activeTab === 'game' && (
          <>
            {/* Top Pier / Deck: Interactive Wicker Baskets for Sorting */}
            <section className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-sky-950/80 border-b border-sky-400/20 py-2">
              <Baskets
                gameMode={gameMode}
                selectedFishPerson={selectedFish?.wordItem.person || null}
                basketCounts={basketCounts}
                onDropFish={handleDropToBasket}
                wobbleBasket={wobbleBasket}
              />
            </section>

            {/* The Ocean Fishing Surface & Swimming Fishes */}
            <section className="flex-1 flex flex-col relative">
              <FishingOcean
                gameMode={gameMode}
                fishes={fishes}
                selectedFish={selectedFish}
                escapeTimeLeft={escapeTimeLeft}
                floatingTexts={floatingTexts}
                isFullscreen={isFullscreen}
                onToggleFullscreen={handleToggleFullscreen}
                onSelectFish={handleSelectFish}
                onDropToBasket={handleDropToBasket}
                onReturnHome={() => setActiveTab('home')}
                onRestartGame={resetGame}
                onEndGame={handleGameOver}
                onOpenRules={() => setIsRulesModalOpen(true)}
              />
            </section>
          </>
        )}

        {/* 2. Learn Page Tab */}
        {activeTab === 'learn' && (
          <LearnPage
            onPlayGame={() => {
              resetGame();
              setActiveTab('game');
            }}
            onStartQuiz={() => setActiveTab('quiz')}
            onGoHome={() => setActiveTab('home')}
          />
        )}

        {/* 3. Quiz Page Tab (30 Questions) */}
        {activeTab === 'quiz' && (
          <QuizPage
            onPlayGame={() => {
              resetGame();
              setActiveTab('game');
            }}
            onOpenLeaderboard={() => {
              setLeaderboardRecords(getLeaderboard());
              setActiveTab('leaderboard');
            }}
            onGoHome={() => setActiveTab('home')}
          />
        )}

        {/* 4. Leaderboard & Ranking Chart Tab */}
        {activeTab === 'leaderboard' && (
          <LeaderboardPage
            records={leaderboardRecords}
            onClearRecords={handleClearLeaderboard}
            onPlayGame={() => {
              resetGame();
              setActiveTab('game');
            }}
            onStartQuiz={() => setActiveTab('quiz')}
            onGoHome={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Educational Immediate Toast */}
      {activeTab === 'game' && (
        <EducationalToast
          word={toastInfo.word}
          isCorrect={toastInfo.isCorrect}
          userChosenPerson={toastInfo.chosen}
          onDismiss={() => setToastInfo({ word: null, isCorrect: true, chosen: null })}
        />
      )}

      {/* Onboarding & Rules Modal (Initial Start Screen & Rules Guide) */}
      <StartRulesModal
        isOpen={isRulesModalOpen}
        currentName={playerName}
        currentAvatar={playerAvatar}
        isFirstStart={!hasStartedGame}
        onStartGame={handleStartGame}
        onClose={() => setIsRulesModalOpen(false)}
      />

      {/* Name Input Modal */}
      <NameModal
        isOpen={isNameModalOpen}
        currentName={playerName}
        currentAvatar={playerAvatar}
        onSave={handleSavePlayer}
        onClose={() => setIsNameModalOpen(false)}
        isInitialSetup={!playerName}
      />

      {/* Game Over Modal */}
      {latestRecord && (
        <GameOverModal
          isOpen={isGameOver}
          scoreRecord={latestRecord}
          onPlayAgain={resetGame}
          onOpenLeaderboard={() => {
            setIsGameOver(false);
            setLeaderboardRecords(getLeaderboard());
            setActiveTab('leaderboard');
          }}
          onGoHome={() => {
            setIsGameOver(false);
            setActiveTab('home');
          }}
        />
      )}

      {/* Universal Footer Credit */}
      <footer className="py-2.5 px-4 bg-slate-950 border-t border-white/5 text-center text-xs text-slate-400">
        สื่อการเรียนรู้ภาษาไทย เรื่อง คำบุรุษสรรพนาม ๓ บุรุษ · <strong className="text-sky-300 font-semibold">Powered by ครูเวย์บิ๊ก</strong>
      </footer>
    </div>
  );
}
