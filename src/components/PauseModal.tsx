import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onQuit,
  isMuted,
  onToggleMute,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="pause-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xs bg-[#003842] border border-teal-600/40 rounded-3xl p-6 text-white shadow-2xl flex flex-col items-center">
        <h2 className="text-2xl font-black tracking-tight text-white mb-6">
          Game Paused
        </h2>

        <div className="w-full space-y-3">
          <button
            id="pause-resume-btn"
            onClick={() => {
              soundManager.playClick();
              onResume();
            }}
            className="w-full py-3.5 rounded-full bg-white hover:bg-teal-50 text-[#003842] font-bold text-base transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Resume</span>
          </button>

          <button
            id="pause-restart-btn"
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="w-full py-3 rounded-full bg-[#02434f] hover:bg-[#045665] text-white font-semibold text-sm transition-all border border-teal-700/40 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Session</span>
          </button>

          <button
            id="pause-mute-btn"
            onClick={onToggleMute}
            className="w-full py-3 rounded-full bg-[#02434f] hover:bg-[#045665] text-teal-100 font-semibold text-sm transition-all border border-teal-700/40 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-teal-400/60" />
                <span>Audio Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Audio On</span>
              </>
            )}
          </button>

          <button
            id="pause-quit-btn"
            onClick={() => {
              soundManager.playClick();
              onQuit();
            }}
            className="w-full py-3 rounded-full bg-transparent hover:bg-[#012d35] text-teal-300 font-semibold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Quit to Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
