import { Contact, DifficultyConfig, GameStats } from '../types';

export const CONTACT_POOL: Contact[] = [
  { name: 'Clarence Mayo', role: 'Fitness Trainer', avatarColor: '#0ea5e9' },
  { name: 'Sophia Zhang', role: 'Landscape Architect', avatarColor: '#10b981' },
  { name: 'Marcus Vance', role: 'Pediatrician', avatarColor: '#f59e0b' },
  { name: 'Elena Rostova', role: 'Marine Biologist', avatarColor: '#6366f1' },
  { name: 'David Sterling', role: 'Financial Analyst', avatarColor: '#ec4899' },
  { name: 'Amara Okafor', role: 'Flight Director', avatarColor: '#8b5cf6' },
  { name: 'Lucas Bennett', role: 'Cyber Security Lead', avatarColor: '#14b8a6' },
  { name: 'Chloe Dubois', role: 'Art Restorer', avatarColor: '#f97316' },
  { name: 'Liam Gallagher', role: 'Acoustic Engineer', avatarColor: '#06b6d4' },
  { name: 'Priya Patel', role: 'Urban Planner', avatarColor: '#e11d48' },
  { name: 'Julian Ross', role: 'Executive Chef', avatarColor: '#84cc16' },
  { name: 'Zoe Washington', role: 'Robotics Researcher', avatarColor: '#3b82f6' },
  { name: 'Adrian Mercer', role: 'Civil Engineer', avatarColor: '#64748b' },
  { name: 'Kiran Sharma', role: 'Astrophysicist', avatarColor: '#a855f7' },
  { name: 'Hannah Lindqvist', role: 'Biochemist', avatarColor: '#22c55e' },
];

export const DIFFICULTY_CONFIGS: Record<number, DifficultyConfig> = {
  1: {
    level: 1,
    digitCount: 5,
    memorizeSeconds: 3.5,
    description: 'Complete all rounds with no mistakes to level up',
  },
  2: {
    level: 2,
    digitCount: 6,
    memorizeSeconds: 3.5,
    description: 'Complete all rounds with no mistakes to level up',
  },
  3: {
    level: 3,
    digitCount: 7,
    memorizeSeconds: 3.2,
    description: 'Complete all rounds with no mistakes to level up',
  },
  4: {
    level: 4,
    digitCount: 8,
    memorizeSeconds: 3.0,
    description: 'Complete all rounds with no mistakes to level up',
  },
  5: {
    level: 5,
    digitCount: 9,
    memorizeSeconds: 2.8,
    description: 'Complete all rounds with no mistakes to level up',
  },
  6: {
    level: 6,
    digitCount: 10,
    memorizeSeconds: 2.5,
    description: 'Master difficulty with maximum 10 digits',
  },
};

export function getDifficultyConfig(level: number): DifficultyConfig {
  if (level < 1) return DIFFICULTY_CONFIGS[1];
  if (level > 6) return DIFFICULTY_CONFIGS[6];
  return DIFFICULTY_CONFIGS[level] || DIFFICULTY_CONFIGS[1];
}

export function generatePhoneNumber(digitCount: number): string {
  // Generate random digits ensuring no obvious trivial repetition
  let result = '';
  let lastDigit = -1;
  for (let i = 0; i < digitCount; i++) {
    let digit: number;
    do {
      digit = Math.floor(Math.random() * 10);
    } while (digit === lastDigit && i > 0 && Math.random() < 0.8);
    result += digit.toString();
    lastDigit = digit;
  }
  return result;
}

export function getRandomContacts(count: number): Contact[] {
  const shuffled = [...CONTACT_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function calculateRank(bestScore: number, difficulty: number): string {
  if (bestScore >= 1200 || difficulty >= 5) return 'Master';
  if (bestScore >= 950 || difficulty >= 4) return 'Expert';
  if (bestScore >= 750 || difficulty >= 3) return 'Proficient';
  if (bestScore >= 500 || difficulty >= 2) return 'Skilled';
  if (bestScore > 0) return 'Amateur';
  return 'Beginner';
}

const STORAGE_KEY = 'lumos_phone_memory_stats_v1';

export function loadGameStats(): GameStats {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        bestScore: parsed.bestScore ?? 985, // seeded with 985 as seen in screenshot
        currentDifficulty: parsed.currentDifficulty ?? 1,
        rank: parsed.rank ?? 'Amateur',
        gamesPlayed: parsed.gamesPlayed ?? 1,
        totalCorrectRounds: parsed.totalCorrectRounds ?? 4,
      };
    }
  } catch (e) {
    console.error('Failed to load stats', e);
  }
  // Default matching screenshot 1
  return {
    bestScore: 985,
    currentDifficulty: 1,
    rank: 'Amateur',
    gamesPlayed: 1,
    totalCorrectRounds: 4,
  };
}

export function saveGameStats(stats: GameStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}
