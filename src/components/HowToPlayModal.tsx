import React from 'react';
import { X, Eye, PhoneCall, Zap, Award } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="how-to-play-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-sm bg-[#003842] border border-teal-600/40 rounded-3xl p-6 text-white shadow-2xl">
        {/* Close button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-teal-900/60 hover:bg-teal-800 text-teal-200 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-4">
          <p className="text-[10px] font-bold tracking-widest text-teal-300 uppercase">
            RULES & GUIDE
          </p>
          <h2 className="text-2xl font-black text-white tracking-tight">
            How to Play
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-teal-800/60 flex items-center justify-center shrink-0 text-cyan-300">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">1. Memorize the Number</h3>
              <p className="text-xs text-teal-200/80 leading-relaxed">
                When a contact card appears, look at the digits carefully before the countdown runs out.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-teal-800/60 flex items-center justify-center shrink-0 text-cyan-300">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">2. Dial the Number</h3>
              <p className="text-xs text-teal-200/80 leading-relaxed">
                Use the numeric keypad or keyboard keys (0-9) to recall and enter the exact sequence.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-teal-800/60 flex items-center justify-center shrink-0 text-cyan-300">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">3. Speed & Accuracy</h3>
              <p className="text-xs text-teal-200/80 leading-relaxed">
                Correct answers earn 100 points, plus up to 100 extra bonus points for answering quickly.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-teal-800/60 flex items-center justify-center shrink-0 text-cyan-300">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">4. Endless Progression</h3>
              <p className="text-xs text-teal-200/80 leading-relaxed">
                Start with 3 numbers first. Consistent correct recalls slowly increase levels and number of digits in an endless memory run!
              </p>
            </div>
          </div>
        </div>

        {/* Got it button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="w-full py-3.5 rounded-full bg-white hover:bg-teal-50 text-[#003842] font-bold text-base transition-all shadow-lg cursor-pointer"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
