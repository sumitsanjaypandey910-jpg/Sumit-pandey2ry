import React, { useState, useCallback } from 'react';
import { OfficeBackdrop } from './components/OfficeBackdrop';
import { StartScreen } from './components/StartScreen';
import { GameplayScreen } from './components/GameplayScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { HowToPlayModal } from './components/HowToPlayModal';
import { PauseModal } from './components/PauseModal';
import { GameStats, RoundData } from './types';
import {
  loadGameStats,
  saveGameStats,
  getDifficultyConfig,
  getRandomContacts,
  generatePhoneNumber,
  calculateRank,
} from './utils/gameData';
import { soundManager } from './utils/audio';

const MAX_LIVES = 3;

export default function App() {
  const [stats, setStats] = useState<GameStats>(() => loadGameStats());
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [levelRoundsCompleted, setLevelRoundsCompleted] = useState<number>(0);
  const [lives, setLives] = useState<number>(MAX_LIVES);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [levelUpToast, setLevelUpToast] = useState<string | null>(null);

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());

  // Results screen state
  const [isNewBest, setIsNewBest] = useState<boolean>(false);

  // Initialize a new endless game session starting with 3 digits
  const startNewGame = useCallback(() => {
    const startingLevel = 1;
    const config = getDifficultyConfig(startingLevel); // 3 digits
    const firstContact = getRandomContacts(1)[0];

    const firstRound: RoundData = {
      roundNumber: 1,
      contact: firstContact,
      phoneNumber: generatePhoneNumber(config.digitCount),
      digitCount: config.digitCount,
      level: startingLevel,
      scoreEarned: 0,
    };

    setRounds([firstRound]);
    setCurrentScore(0);
    setCurrentLevel(startingLevel);
    setLevelRoundsCompleted(0);
    setLives(MAX_LIVES);
    setStreak(0);
    setBestStreak(0);
    setLevelUpToast(null);
    setIsPaused(false);
    setGamePhase('playing');
  }, []);

  // End session and save score
  const finalizeSession = useCallback(
    (allRounds: RoundData[], finalScore: number, finalStreak: number, finalLevel: number) => {
      const correctRounds = allRounds.filter((r) => r.isCorrect).length;
      const hasNewBest = finalScore > stats.bestScore;
      const newBestScore = Math.max(stats.bestScore, finalScore);
      const newMaxLevel = Math.max(stats.maxLevel ?? 1, finalLevel);
      const newBestStreak = Math.max(stats.bestStreak ?? 0, finalStreak);
      const updatedRank = calculateRank(newBestScore, newMaxLevel);

      const updatedStats: GameStats = {
        bestScore: newBestScore,
        currentDifficulty: Math.max(stats.currentDifficulty, finalLevel),
        maxLevel: newMaxLevel,
        bestStreak: newBestStreak,
        rank: updatedRank,
        gamesPlayed: stats.gamesPlayed + 1,
        totalCorrectRounds: stats.totalCorrectRounds + correctRounds,
      };

      setStats(updatedStats);
      saveGameStats(updatedStats);
      setIsNewBest(hasNewBest);
      setGamePhase('results');
    },
    [stats]
  );

  // Handle round completion in endless mode
  const handleRoundComplete = useCallback(
    (userAnswer: string, isCorrect: boolean, timeTakenMs: number) => {
      if (rounds.length === 0) return;

      const currentRound = rounds[rounds.length - 1];

      let roundScore = 0;
      let nextScore = currentScore;
      let nextStreak = 0;
      let nextBestStreak = bestStreak;
      let nextLevelRounds = levelRoundsCompleted;
      let nextLevel = currentLevel;
      let nextLives = lives;

      if (isCorrect) {
        const speedBonus = Math.max(20, Math.floor(100 - (timeTakenMs / 1000) * 15));
        const streakBonus = streak * 15;
        roundScore = 100 + speedBonus + streakBonus;
        nextScore = currentScore + roundScore;
        nextStreak = streak + 1;
        nextBestStreak = Math.max(bestStreak, nextStreak);
        nextLevelRounds = levelRoundsCompleted + 1;

        // Check level up (e.g. 3 correct rounds at this level)
        const currentConfig = getDifficultyConfig(currentLevel);
        if (nextLevelRounds >= currentConfig.roundsToLevelUp) {
          nextLevel = currentLevel + 1;
          nextLevelRounds = 0;
          const nextConfig = getDifficultyConfig(nextLevel);
          soundManager.playLevelUp();
          setLevelUpToast(`Level Up! ${nextConfig.digitCount} Digits`);
          setTimeout(() => setLevelUpToast(null), 2500);
        }
      } else {
        roundScore = 0;
        nextStreak = 0;
        nextLives = lives - 1;
      }

      // Update current round in list
      const completedRound: RoundData = {
        ...currentRound,
        userAnswer,
        isCorrect,
        timeTakenMs,
        scoreEarned: roundScore,
      };
      const updatedRounds = [...rounds.slice(0, -1), completedRound];

      if (nextLives <= 0) {
        // Endless run ended due to 3 mistakes
        setRounds(updatedRounds);
        setCurrentScore(nextScore);
        setLives(0);
        finalizeSession(updatedRounds, nextScore, nextBestStreak, nextLevel);
      } else {
        // Continue to the next round seamlessly!
        const nextRoundNumber = updatedRounds.length + 1;
        const nextConfig = getDifficultyConfig(nextLevel);
        const nextContact = getRandomContacts(1)[0];
        const nextPhoneNumber = generatePhoneNumber(nextConfig.digitCount);

        const nextRound: RoundData = {
          roundNumber: nextRoundNumber,
          contact: nextContact,
          phoneNumber: nextPhoneNumber,
          digitCount: nextConfig.digitCount,
          level: nextLevel,
          scoreEarned: 0,
        };

        setRounds([...updatedRounds, nextRound]);
        setCurrentScore(nextScore);
        setCurrentLevel(nextLevel);
        setLevelRoundsCompleted(nextLevelRounds);
        setLives(nextLives);
        setStreak(nextStreak);
        setBestStreak(nextBestStreak);
      }
    },
    [rounds, currentScore, currentLevel, levelRoundsCompleted, lives, streak, bestStreak, finalizeSession]
  );

  const handleFinishEarly = useCallback(() => {
    setIsPaused(false);
    finalizeSession(rounds, currentScore, bestStreak, currentLevel);
  }, [rounds, currentScore, bestStreak, currentLevel, finalizeSession]);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    soundManager.setMuted(nextMuted);
    setIsMuted(nextMuted);
  }, [isMuted]);

  const activeRound = rounds[rounds.length - 1];
  const activeConfig = getDifficultyConfig(currentLevel);
  const maxDigitsReached = Math.max(3, ...rounds.map((r) => r.digitCount || 3));

  return (
    <div className="relative w-screen h-screen min-h-screen bg-[#002228] flex items-center justify-center overflow-hidden font-sans">
      {/* Container simulating high-fidelity mobile app canvas */}
      <main
        id="app-container"
        className="relative w-full h-full sm:max-w-md sm:h-[92vh] sm:max-h-[850px] sm:rounded-3xl sm:border sm:border-teal-800/40 shadow-2xl overflow-hidden flex flex-col bg-[#003842]"
      >
        {/* Deep stylized vector office backdrop */}
        <OfficeBackdrop />

        {/* Dynamic View Router */}
        {gamePhase === 'intro' && (
          <StartScreen
            stats={stats}
            onStartGame={startNewGame}
            onOpenHelp={() => setIsHelpOpen(true)}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
        )}

        {gamePhase === 'playing' && activeRound && !isPaused && (
          <GameplayScreen
            key={activeRound.roundNumber}
            currentRound={activeRound.roundNumber}
            score={currentScore}
            contact={activeRound.contact}
            phoneNumber={activeRound.phoneNumber}
            level={currentLevel}
            levelRoundsCompleted={levelRoundsCompleted}
            levelRoundsNeeded={activeConfig.roundsToLevelUp}
            lives={lives}
            maxLives={MAX_LIVES}
            streak={streak}
            levelUpToast={levelUpToast}
            memorizeDurationSeconds={activeConfig.memorizeSeconds}
            onRoundComplete={handleRoundComplete}
            onPause={() => setIsPaused(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
          />
        )}

        {gamePhase === 'results' && (
          <ResultsScreen
            stats={stats}
            rounds={rounds}
            finalScore={currentScore}
            maxLevel={currentLevel}
            maxDigits={maxDigitsReached}
            bestStreak={bestStreak}
            isNewBest={isNewBest}
            onPlayAgain={startNewGame}
            onGoHome={() => setGamePhase('intro')}
          />
        )}

        {/* How To Play Modal */}
        <HowToPlayModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        />

        {/* Pause Modal */}
        <PauseModal
          isOpen={isPaused}
          onResume={() => setIsPaused(false)}
          onRestart={() => {
            setIsPaused(false);
            startNewGame();
          }}
          onFinishSession={handleFinishEarly}
          onQuit={() => {
            setIsPaused(false);
            setGamePhase('intro');
          }}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
      </main>
    </div>
  );
}
