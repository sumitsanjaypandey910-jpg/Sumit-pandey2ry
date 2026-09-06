import React from 'react';
import { Trophy, ArrowUpCircle, RotateCcw, Home, CheckCircle2, XCircle } from 'lucide-react';
import { RoundData, GameStats } from '../types';
import { soundManager } from '../utils/audio';

interface ResultsScreenProps {
  stats: GameStats;
  rounds: RoundData[];
  finalScore: number;
  isNewBest: boolean;
  leveledUp: boolean;
  previousLevel: number;
  newLevel: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  stats,
  rounds,
  finalScore,
  isNewBest,
  leveledUp,
  previousLevel,
  newLevel,
  onPlayAgain,
  onGoHome,
}) => {
  const correctCount = rounds.filter((r) => r.isCorrect).length;
  const accuracyPercent = Math.round((correctCount / Math.max(1, rounds.length)) * 100);

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-full max-w-md mx-auto px-5 py-6 text-white select-none">
      {/* Top Header */}
      <div className="text-center pt-2">
        <p className="text-xs font-bold tracking-widest text-teal-200/80 uppercase mb-1">
          TRAINING COMPLETE
        </p>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Session Summary
        </h1>
      </div>

      {/* Main Score & Stats Card */}
      <div className="my-4 space-y-3">
        {/* Score Card */}
        <div className="bg-[#01353e]/80 border border-teal-700/40 rounded-3xl p-5 shadow-xl flex flex-col items-center">
          {isNewBest && (
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-bold mb-3 animate-pulse">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>NEW PERSONAL BEST!</span>
            </div>
          )}

          <p className="text-xs font-bold tracking-wider text-teal-200/70 uppercase">
            FINAL SCORE
          </p>
          <p className="text-5xl font-black text-white tracking-tight my-1">
            {finalScore}
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-4 border-t border-teal-800/40">
            <div className="text-center">
              <p className="text-[11px] font-semibold text-teal-200/60 uppercase">
                ACCURACY
              </p>
              <p className="text-xl font-bold text-white">
                {correctCount}/{rounds.length} ({accuracyPercent}%)
              </p>
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-teal-200/60 uppercase">
                RANK
              </p>
              <p className="text-xl font-bold text-teal-200">
                {stats.rank}
              </p>
            </div>
          </div>
        </div>

        {/* Level Up Announcement Banner */}
        {leveledUp ? (
          <div className="bg-gradient-to-r from-emerald-950/80 to-teal-900/80 border border-emerald-500/40 rounded-2xl p-4 flex items-center space-x-3.5 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-300">
              <ArrowUpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-200">
                Difficulty Level Up!
              </h3>
              <p className="text-xs text-emerald-100/80">
                Perfect score! Advanced from Level {previousLevel} to Level {newLevel}.
              </p>
            </div>
          </div>
        ) : correctCount < rounds.length ? (
          <div className="bg-[#02333b]/60 border border-teal-800/30 rounded-2xl p-3 text-center">
            <p className="text-xs text-teal-200/80">
              Complete all rounds without mistakes to reach the next difficulty level.
            </p>
          </div>
        ) : null}

        {/* Round by Round Breakdown */}
        <div className="bg-[#01353e]/60 border border-teal-700/30 rounded-2xl p-3.5 max-h-44 overflow-y-auto space-y-2">
          <p className="text-[10px] font-bold tracking-wider text-teal-200/70 uppercase mb-2">
            ROUND BREAKDOWN
          </p>
          {rounds.map((round) => (
            <div
              key={round.roundNumber}
              className="flex items-center justify-between text-xs py-1.5 border-b border-teal-900/40 last:border-0"
            >
              <div className="flex items-center space-x-2">
                {round.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-white">
                    {round.contact.name}
                  </span>
                  <span className="text-teal-300/60 ml-1.5 hidden sm:inline">
                    ({round.contact.role})
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3 font-mono">
                <span className="text-teal-200 tracking-wider">
                  {round.phoneNumber}
                </span>
                <span className="text-emerald-300 font-bold text-[11px] w-12 text-right">
                  +{round.scoreEarned}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          id="play-again-btn"
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="w-full py-4 rounded-full bg-white hover:bg-teal-50 active:scale-[0.98] text-[#003842] font-extrabold text-lg tracking-wide shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Play Again</span>
        </button>

        <button
          id="go-home-btn"
          onClick={() => {
            soundManager.playClick();
            onGoHome();
          }}
          className="w-full py-3.5 rounded-full bg-[#032e36] hover:bg-[#06424e] active:scale-[0.98] text-teal-200 font-bold text-sm tracking-wide border border-teal-700/40 transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>
      </div>
    </div>
  );
};
