import React, { useState, useEffect, useCallback } from 'react';
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

export default function App() {
  const [stats, setStats] = useState<GameStats>(() => loadGameStats());
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());

  // Results screen state
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [leveledUp, setLeveledUp] = useState<boolean>(false);
  const [previousLevel, setPreviousLevel] = useState<number>(1);
  const [newLevel, setNewLevel] = useState<number>(1);

  // Initialize a new 5-round game session
  const startNewGame = useCallback(() => {
    const config = getDifficultyConfig(stats.currentDifficulty);
    const contacts = getRandomContacts(5);

    const generatedRounds: RoundData[] = contacts.map((contact, idx) => ({
      roundNumber: idx + 1,
      contact,
      phoneNumber: generatePhoneNumber(config.digitCount),
      scoreEarned: 0,
    }));

    setRounds(generatedRounds);
    setCurrentRoundIndex(0);
    setCurrentScore(0);
    setIsPaused(false);
    setGamePhase('playing');
  }, [stats.currentDifficulty]);

  // Handle round completion
  const handleRoundComplete = useCallback(
    (userAnswer: string, isCorrect: boolean, timeTakenMs: number) => {
      const config = getDifficultyConfig(stats.currentDifficulty);
      const speedBonus = isCorrect
        ? Math.max(20, Math.floor(100 - (timeTakenMs / 1000) * 15))
        : 0;
      const pointsEarned = isCorrect ? 100 + speedBonus : 0;
      const updatedTotalScore = currentScore + pointsEarned;

      setCurrentScore(updatedTotalScore);

      const updatedRounds = [...rounds];
      updatedRounds[currentRoundIndex] = {
        ...updatedRounds[currentRoundIndex],
        userAnswer,
        isCorrect,
        timeTakenMs,
        scoreEarned: pointsEarned,
      };
      setRounds(updatedRounds);

      if (currentRoundIndex < rounds.length - 1) {
        // Advance to next round
        setCurrentRoundIndex((prev) => prev + 1);
      } else {
        // Game session completed
        const correctCount = updatedRounds.filter((r) => r.isCorrect).length;
        const perfectSession = correctCount === updatedRounds.length;

        const prevLvl = stats.currentDifficulty;
        let nextLvl = prevLvl;

        if (perfectSession && prevLvl < 6) {
          nextLvl = prevLvl + 1;
          soundManager.playLevelUp();
        }

        const newBestScore = Math.max(stats.bestScore, updatedTotalScore);
        const hasNewBest = updatedTotalScore > stats.bestScore;
        const updatedRank = calculateRank(newBestScore, nextLvl);

        const updatedStats: GameStats = {
          bestScore: newBestScore,
          currentDifficulty: nextLvl,
          rank: updatedRank,
          gamesPlayed: stats.gamesPlayed + 1,
          totalCorrectRounds: stats.totalCorrectRounds + correctCount,
        };

        setStats(updatedStats);
        saveGameStats(updatedStats);

        setIsNewBest(hasNewBest);
        setLeveledUp(perfectSession && nextLvl > prevLvl);
        setPreviousLevel(prevLvl);
        setNewLevel(nextLvl);
        setGamePhase('results');
      }
    },
    [currentRoundIndex, rounds, currentScore, stats]
  );

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    soundManager.setMuted(nextMuted);
    setIsMuted(nextMuted);
  }, [isMuted]);

  const currentRound = rounds[currentRoundIndex];
  const difficultyConfig = getDifficultyConfig(stats.currentDifficulty);

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

        {gamePhase === 'playing' && currentRound && !isPaused && (
          <GameplayScreen
            key={currentRound.roundNumber}
            currentRound={currentRound.roundNumber}
            totalRounds={rounds.length}
            score={currentScore}
            contact={currentRound.contact}
            phoneNumber={currentRound.phoneNumber}
            memorizeDurationSeconds={difficultyConfig.memorizeSeconds}
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
            isNewBest={isNewBest}
            leveledUp={leveledUp}
            previousLevel={previousLevel}
            newLevel={newLevel}
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
