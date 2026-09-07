import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HelpCircle, Pause, Delete, User, Check, X, Heart } from 'lucide-react';
import { Contact } from '../types';
import { soundManager } from '../utils/audio';

interface GameplayScreenProps {
  currentRound: number;
  score: number;
  contact: Contact;
  phoneNumber: string;
  level: number;
  levelRoundsCompleted: number;
  levelRoundsNeeded: number;
  lives: number;
  maxLives: number;
  streak: number;
  levelUpToast: string | null;
  memorizeDurationSeconds: number;
  onRoundComplete: (userAnswer: string, isCorrect: boolean, timeTakenMs: number) => void;
  onPause: () => void;
  onOpenHelp: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  currentRound,
  score,
  contact,
  phoneNumber,
  level,
  levelRoundsCompleted,
  levelRoundsNeeded,
  lives,
  maxLives,
  streak,
  levelUpToast,
  memorizeDurationSeconds,
  onRoundComplete,
  onPause,
  onOpenHelp,
}) => {
  const [phase, setPhase] = useState<'memorize' | 'input' | 'feedback'>('memorize');
  const [userInput, setUserInput] = useState<string>('');
  const [memorizeTimeLeft, setMemorizeTimeLeft] = useState<number>(memorizeDurationSeconds);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackBonus, setFeedbackBonus] = useState<number>(0);
  const inputStartTimeRef = useRef<number>(0);

  const digitCount = phoneNumber.length;

  // Memorization countdown timer
  useEffect(() => {
    setPhase('memorize');
    setUserInput('');
    setIsCorrect(null);
    setMemorizeTimeLeft(memorizeDurationSeconds);

    const intervalMs = 50;
    const startTime = Date.now();
    const durationMs = memorizeDurationSeconds * 1000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingMs = Math.max(0, durationMs - elapsed);
      const remainingSec = remainingMs / 1000;
      setMemorizeTimeLeft(remainingSec);

      if (remainingSec <= 0) {
        clearInterval(timer);
        setPhase('input');
        inputStartTimeRef.current = Date.now();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [phoneNumber, memorizeDurationSeconds, currentRound]);

  // Handle number submission
  const handleSubmit = useCallback(() => {
    if (phase !== 'input' || userInput.length === 0) return;

    const timeTaken = Math.max(0, Date.now() - inputStartTimeRef.current);
    const correct = userInput === phoneNumber;

    setIsCorrect(correct);
    setPhase('feedback');

    if (correct) {
      soundManager.playCorrect();
      // Base score 100 + speed bonus up to 100
      const speedBonus = Math.max(20, Math.floor(100 - (timeTaken / 1000) * 15));
      const totalEarned = 100 + speedBonus;
      setFeedbackBonus(totalEarned);
    } else {
      soundManager.playWrong();
      setFeedbackBonus(0);
    }

    const timer = setTimeout(() => {
      onRoundComplete(userInput, correct, timeTaken);
    }, 1400);

    return () => clearTimeout(timer);
  }, [phase, userInput, phoneNumber, onRoundComplete]);

  // Keypad press handler
  const handleDigitPress = useCallback((digit: string) => {
    if (phase !== 'input') return;
    if (userInput.length >= digitCount) return;

    soundManager.playDtmf(digit);
    const nextInput = userInput + digit;
    setUserInput(nextInput);

    // If reached max digits, automatically submit after slight delay or allow user to press submit
    if (nextInput.length === digitCount) {
      setTimeout(() => {
        // Auto-check if completed
      }, 100);
    }
  }, [phase, userInput, digitCount]);

  const handleBackspace = useCallback(() => {
    if (phase !== 'input' || userInput.length === 0) return;
    soundManager.playClick();
    setUserInput((prev) => prev.slice(0, -1));
  }, [phase, userInput]);

  // Keyboard navigation & numpad support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'input') return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleDigitPress, handleBackspace, handleSubmit]);

  const progressPercent = (memorizeTimeLeft / memorizeDurationSeconds) * 100;

  return (
    <div className="relative z-10 flex flex-col justify-between min-h-full max-w-md mx-auto px-4 py-4 text-white select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full mb-2">
        {/* Pause Button */}
        <button
          id="pause-button"
          onClick={() => {
            soundManager.playClick();
            onPause();
          }}
          className="w-10 h-10 rounded-full bg-[#002f37]/80 hover:bg-[#00424d] flex items-center justify-center text-teal-200 transition-colors border border-teal-800/40 cursor-pointer"
          title="Pause Game"
          aria-label="Pause"
        >
          <Pause className="w-5 h-5 fill-current" />
        </button>

        {/* Center Progress Pill: Round X   Score */}
        <div className="flex items-center justify-between px-6 py-2 rounded-full bg-[#032930]/90 border border-teal-800/40 w-52 shadow-inner">
          <span className="text-base font-bold text-teal-100 tracking-wider">
            Round {currentRound}
          </span>
          <span className="text-base font-extrabold text-white tracking-wider">
            {score}
          </span>
        </div>

        {/* Help Button */}
        <button
          id="gameplay-help-button"
          onClick={() => {
            soundManager.playClick();
            onOpenHelp();
          }}
          className="w-10 h-10 rounded-full bg-[#002f37]/80 hover:bg-[#00424d] flex items-center justify-center text-teal-200 transition-colors border border-teal-800/40 cursor-pointer"
          title="Help"
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Endless HUD Status Row: Lives, Level Progress, Streak */}
      <div className="flex items-center justify-between w-full px-1 mb-2">
        {/* Lives / Hearts */}
        <div className="flex items-center space-x-1.5 bg-[#002830]/80 px-2.5 py-1 rounded-full border border-teal-800/40">
          {Array.from({ length: maxLives }).map((_, i) => (
            <Heart
              key={i}
              className={`w-3.5 h-3.5 transition-all duration-300 ${
                i < lives
                  ? 'fill-rose-500 text-rose-500 drop-shadow-[0_0_5px_rgba(244,63,94,0.6)] scale-100'
                  : 'fill-transparent text-teal-800/60 scale-75'
              }`}
            />
          ))}
        </div>

        {/* Level & Digits Indicator */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#002830]/80 border border-teal-800/40 text-[11px] font-semibold text-teal-200 shadow-xs">
          <span className="font-bold text-white">Lvl {level}</span>
          <span className="text-teal-500">•</span>
          <span className="text-amber-300 font-bold">{digitCount} Digits</span>
          <span className="text-teal-400 text-[10px]">
            ({levelRoundsCompleted}/{levelRoundsNeeded})
          </span>
        </div>

        {/* Streak Counter */}
        <div className="min-w-[48px] flex justify-end">
          {streak >= 2 ? (
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold animate-pulse">
              <span>🔥</span>
              <span>{streak}</span>
            </div>
          ) : (
            <div className="text-[10px] text-teal-400/60 font-semibold px-2 py-0.5">
              Endless
            </div>
          )}
        </div>
      </div>

      {/* Level-Up Celebration Toast */}
      {levelUpToast && (
        <div className="w-full flex justify-center mb-1">
          <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-[#003842] py-1.5 px-4 rounded-full font-black text-xs tracking-wide shadow-lg border border-amber-200 animate-bounce flex items-center space-x-1.5">
            <span>✨</span>
            <span>{levelUpToast}</span>
            <span>✨</span>
          </div>
        </div>
      )}

      {/* Instructional Badge */}
      <div className="flex justify-center w-full my-1.5">
        <div className="px-6 py-1.5 rounded-lg bg-[#002830]/90 border border-teal-800/50 shadow-sm transition-all duration-300">
          <p className="text-sm font-bold text-teal-100 tracking-wide text-center">
            {phase === 'memorize' ? 'Memorize the number' : 'Input the number'}
          </p>
        </div>
      </div>

      {/* Central Contact Card Area */}
      <div className="w-full flex-1 flex flex-col justify-center items-center py-2">
        <div
          id="contact-card"
          className={`relative w-full max-w-sm rounded-3xl p-6 transition-all duration-300 shadow-2xl flex flex-col items-center justify-between min-h-[220px] ${
            isCorrect === true
              ? 'bg-gradient-to-b from-[#2dd4bf] to-[#0d9488] ring-4 ring-emerald-400/80 shadow-emerald-900/40'
              : isCorrect === false
              ? 'bg-gradient-to-b from-[#38bdf8] to-[#0284c7] ring-4 ring-rose-500/80'
              : 'bg-gradient-to-b from-[#22d3ee] via-[#06b6d4] to-[#0891b2]'
          }`}
        >
          {/* Subtle glossy sheen highlight */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl pointer-events-none" />

          {/* Memorize countdown timer bar on card */}
          {phase === 'memorize' && (
            <div className="absolute top-3 left-6 right-6 h-1.5 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/90 rounded-full transition-all duration-75 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}

          {/* Contact Avatar */}
          <div className="relative mt-2 mb-2 w-16 h-16 rounded-full bg-[#056d7a]/25 flex items-center justify-center border-2 border-white/30 text-[#003842]">
            <User className="w-9 h-9 text-[#003d47]" />
          </div>

          {/* Contact Name & Role */}
          <div className="text-center mb-3">
            <h3 className="text-xl font-extrabold text-[#00353e] tracking-tight">
              {contact.name}
            </h3>
            <p className="text-xs font-semibold text-[#004f5c] tracking-wide opacity-90">
              {contact.role}
            </p>
          </div>

          {/* Number Display Container */}
          <div
            id="number-display-box"
            className="w-full bg-[#04242b] rounded-2xl py-3 px-4 shadow-inner flex flex-col items-center justify-center min-h-[64px]"
          >
            {phase === 'memorize' ? (
              // Memorization phase: Crisp visible phone number
              <div className="flex items-center justify-center space-x-2 animate-fadeIn">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-[0.25em]">
                  {phoneNumber}
                </span>
              </div>
            ) : phase === 'feedback' ? (
              // Feedback phase: show result
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2">
                  {isCorrect ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
                      <span className="text-2xl font-black text-emerald-300 tracking-[0.2em]">
                        {phoneNumber}
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-rose-400 stroke-[3]" />
                      <span className="text-lg font-bold text-rose-300 line-through mr-2">
                        {userInput || 'Empty'}
                      </span>
                      <span className="text-xl font-extrabold text-white tracking-widest">
                        {phoneNumber}
                      </span>
                    </>
                  )}
                </div>
                {isCorrect && (
                  <span className="text-xs font-bold text-emerald-400 mt-0.5">
                    +{feedbackBonus} pts
                  </span>
                )}
              </div>
            ) : (
              // Input phase: Dots placeholder with active cursor underline
              <div className="flex items-center justify-center space-x-3.5 sm:space-x-4">
                {Array.from({ length: digitCount }).map((_, idx) => {
                  const hasChar = idx < userInput.length;
                  const isCurrent = idx === userInput.length;

                  return (
                    <div
                      key={idx}
                      className="relative flex flex-col items-center justify-center w-6 h-8"
                    >
                      {hasChar ? (
                        <span className="text-2xl font-bold text-white leading-none">
                          {userInput[idx]}
                        </span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-teal-300/40 inline-block mb-1" />
                      )}

                      {/* Active cursor underline */}
                      {isCurrent && (
                        <div className="absolute -bottom-1 w-4 h-0.5 bg-white animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keypad Grid (Exact match to Screenshot 2) */}
      <div className="w-full max-w-sm mx-auto mb-2 select-none">
        <div className="grid grid-cols-3 gap-2.5">
          {/* Row 1 */}
          <button
            id="keypad-1"
            disabled={phase !== 'input'}
            onClick={() => handleDigitPress('1')}
            className="h-14 rounded-xl bg-[#14424a] hover:bg-[#1d555f] active:bg-[#286f7c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            1
          </button>
          <button
            id="keypad-2"
            disabled={phase !== 'input'}
            onClick={() => handleDigitPress('2')}
            className="h-14 rounded-xl bg-[#14424a] hover:bg-[#1d555f] active:bg-[#286f7c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            2
          </button>
          <button
            id="keypad-3"
            disabled={phase !== 'input'}
            onClick={() => handleDigitPress('3')}
            className="h-14 rounded-xl bg-[#14424a] hover:bg-[#1d555f] active:bg-[#286f7c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            3
          </button>

          {/* Row 2 */}
          <button
            id="keypad-4"
            disabled={phase !== 'input'}
            onClick={() => handleDigitPress('4')}
            className="h-14 rounded-xl bg-[#14424a] hover:bg-[#1d555f] active:bg-[#286f7c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            4
          </button>
          <button
            id="keypad-5"
            disabled={phase !== 'input'}
            onClick={() => handleDigitPress('5')}
            className="h-14 rounded-xl bg-[#14424a] hover:bg-[#1d555f] active:bg-[#286f7c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            5
          </button>
          <button
            id="keypad-6"
            disabled={phase !== 'input'}
            onClick={() => handleDigitPress('6')}
            className="h-14 rounded-xl bg-[#14424a] hover:bg-[#1d555f] active:bg-[#286f7c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            6
          </button>

          {/* Row 3 */}
          <button
            id="keypad-7"
            disabled={phase !== 'input'}
            onClick={() => handleDigitPress('7')}
            className="h-14 rounded-xl bg-[#14424a] hover:bg-[#1d555f] active:bg-[#286f7c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            7
          </button>
          <button
            id="keypad-8"
            disabled={phase !== 'input'}
            onClick={() => handleDigitPress('8')}
            className="h-14 rounded-xl bg-[#14424a] hover:bg-[#1d555f] active:bg-[#286f7c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            8
          </button>
          <button
            id="keypad-9"
            disabled={phase !== 'input'}
            onClick={() => handleDigitPress('9')}
            className="h-14 rounded-xl bg-[#14424a] hover:bg-[#1d555f] active:bg-[#286f7c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            9
          </button>

          {/* Row 4: Backspace, 0, submit */}
          <button
            id="keypad-backspace"
            disabled={phase !== 'input' || userInput.length === 0}
            onClick={handleBackspace}
            className="h-14 rounded-xl bg-[#14424a] hover:bg-[#1d555f] active:bg-[#286f7c] disabled:opacity-40 disabled:cursor-not-allowed text-teal-200 transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-95"
            title="Backspace"
            aria-label="Backspace"
          >
            <Delete className="w-6 h-6" />
          </button>

          <button
            id="keypad-0"
            disabled={phase !== 'input'}
            onClick={() => handleDigitPress('0')}
            className="h-14 rounded-xl bg-[#14424a] hover:bg-[#1d555f] active:bg-[#286f7c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            0
          </button>

          <button
            id="keypad-submit"
            disabled={phase !== 'input' || userInput.length === 0}
            onClick={handleSubmit}
            className="h-14 rounded-xl bg-[#14424a] hover:bg-[#1d555f] active:bg-[#286f7c] disabled:opacity-40 disabled:cursor-not-allowed text-teal-100 hover:text-white text-base font-semibold lowercase transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            submit
          </button>
        </div>
      </div>
    </div>
  );
};
