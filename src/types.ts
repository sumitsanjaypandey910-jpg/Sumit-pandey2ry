export type GamePhase = 'intro' | 'memorizing' | 'inputting' | 'feedback' | 'gameover';

export interface Contact {
  name: string;
  role: string;
  avatarColor: string;
}

export interface RoundData {
  roundNumber: number;
  contact: Contact;
  phoneNumber: string; // digits string e.g. "48219"
  userAnswer?: string;
  isCorrect?: boolean;
  timeTakenMs?: number;
  scoreEarned: number;
}

export interface GameStats {
  bestScore: number;
  currentDifficulty: number;
  rank: string;
  gamesPlayed: number;
  totalCorrectRounds: number;
}

export interface DifficultyConfig {
  level: number;
  digitCount: number;
  memorizeSeconds: number;
  description: string;
}
