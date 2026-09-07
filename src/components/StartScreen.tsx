import React from 'react';
import { Trophy, Shield, HelpCircle, Volume2, VolumeX, X } from 'lucide-react';
import { GameStats } from '../types';
import { soundManager } from '../utils/audio';

interface StartScreenProps {
  stats: GameStats;
  onStartGame: () => void;
  onOpenHelp: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  stats,
  onStartGame,
  onOpenHelp,
  isMuted,
  onToggleMute,
}) => {
  const handleStart = () => {
    soundManager.playClick();
    onStartGame();
  };

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-full max-w-md mx-auto px-6 py-6 text-white select-none">
      {/* Top action bar (matches Screenshot 1 with X on left, ? on right) */}
      <div className="flex items-center justify-between w-full mb-3">
        <button
          id="close-button"
          onClick={() => {
            soundManager.playClick();
            // Refreshes view or scrolls
          }}
          className="w-10 h-10 rounded-full bg-[#002f37]/80 hover:bg-[#00424d] flex items-center justify-center text-teal-200 transition-colors border border-teal-800/40 cursor-pointer"
          title="Close"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <button
            id="sound-toggle-btn"
            onClick={onToggleMute}
            className="w-10 h-10 rounded-full bg-[#002f37]/80 hover:bg-[#00424d] flex items-center justify-center text-teal-200 transition-colors border border-teal-800/40 cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-teal-400/60" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            id="help-button"
            onClick={() => {
              soundManager.playClick();
              onOpenHelp();
            }}
            className="w-10 h-10 rounded-full bg-[#002f37]/80 hover:bg-[#00424d] flex items-center justify-center text-teal-200 transition-colors border border-teal-800/40 cursor-pointer"
            title="Game Rules & Info"
            aria-label="How to play"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center">
        {/* Large Iconic Phone Badge */}
        <div className="relative mb-5 flex items-center justify-center">
          {/* Layered Outer Rounded Squircle */}
          <div className="w-36 h-36 rounded-[36px] bg-[#02414c]/75 border-2 border-teal-500/25 flex items-center justify-center shadow-2xl backdrop-blur-xs">
            {/* Inner Golden Yellow Disc */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#f59e0b] via-[#fbbf24] to-[#fde047] flex items-center justify-center shadow-md shadow-amber-900/30">
              {/* White Telephone Handset SVG rotated 45 deg */}
              <svg
                className="w-13 h-13 text-white drop-shadow-sm transform -rotate-12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title and Category */}
        <div className="text-left w-full mb-5">
          <p className="text-[11px] font-bold tracking-widest text-teal-200/75 uppercase mb-1">
            MEMORY
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Phone number
          </h1>
        </div>

        {/* Best Score & Rank Cards */}
        <div className="grid grid-cols-2 gap-4 w-full mb-6">
          <div className="flex items-center space-x-3 bg-[#01353e]/60 border border-teal-700/30 rounded-2xl p-3">
            <div className="w-9 h-9 rounded-xl bg-teal-800/40 flex items-center justify-center text-teal-300">
              <Trophy className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-teal-200/70 uppercase">
                BEST SCORE
              </p>
              <p className="text-xl font-bold text-white leading-tight">
                {stats.bestScore}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-[#01353e]/60 border border-teal-700/30 rounded-2xl p-3">
            <div className="w-9 h-9 rounded-xl bg-teal-800/40 flex items-center justify-center text-teal-300">
              <Shield className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-teal-200/70 uppercase">
                RANK
              </p>
              <p className="text-xl font-bold text-white leading-tight">
                {stats.rank}
              </p>
            </div>
          </div>
        </div>

        {/* Difficulty Banner */}
        <div className="w-full mb-6">
          <p className="text-[10px] font-bold tracking-widest text-teal-200/75 uppercase mb-1.5">
            DIFFICULTY
          </p>
          <div className="flex items-center bg-[#013b45]/85 border border-teal-600/30 rounded-2xl overflow-hidden shadow-inner">
            {/* Number tab */}
            <div className="w-16 py-4 bg-[#024f5c] flex items-center justify-center border-r border-teal-700/40">
              <span className="text-2xl font-black text-white">
                {stats.currentDifficulty}
              </span>
            </div>
            {/* Description text */}
            <div className="px-4 py-3 flex-1">
              <p className="text-sm font-medium text-teal-100 leading-snug">
                Starts with 3 numbers • Endless run with gradual level scaling
              </p>
            </div>
          </div>
        </div>

        {/* Skills Trained section */}
        <div className="w-full mb-6">
          <p className="text-[10px] font-bold tracking-widest text-teal-200/75 uppercase mb-3">
            SKILLS TRAINED
          </p>
          <div className="space-y-3">
            {/* Working Memory */}
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-full bg-[#054955] flex items-center justify-center shrink-0 border border-teal-600/40 text-teal-200 shadow-sm">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M8 4v4" />
                  <path d="M16 4v4" />
                  <circle cx="12" cy="13" r="2" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Working memory</h2>
                <p className="text-xs text-teal-200/75 leading-relaxed">
                  Improve your ability to hold and manipulate information in your mind over short periods
                </p>
              </div>
            </div>

            {/* Visual Processing Speed */}
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-full bg-[#054955] flex items-center justify-center shrink-0 border border-teal-600/40 text-teal-200 shadow-sm">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Visual processing speed</h2>
                <p className="text-xs text-teal-200/75 leading-relaxed">
                  Boost the speed at which you process and react to visual information
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="w-full pt-2 pb-4">
        <button
          id="start-game-button"
          onClick={handleStart}
          className="w-full py-4 rounded-full bg-white hover:bg-teal-50 active:scale-[0.98] text-[#003842] font-extrabold text-lg tracking-wide shadow-xl transition-all flex items-center justify-center cursor-pointer"
        >
          Start
        </button>
      </div>
    </div>
  );
};
