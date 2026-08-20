export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type LearningStatus = 'NEW' | 'LEARNING' | 'REMEMBERED' | 'REVIEW';

export interface Word {
  id: string;
  word: string;
  meaning: string;
  example: string;
  category: string;
  difficulty: Difficulty;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWordInput {
  word: string;
  meaning: string;
  example?: string;
  category: string;
  difficulty: Difficulty;
}

export interface UpdateWordInput {
  id: string;
  word?: string;
  meaning?: string;
  example?: string;
  category?: string;
  difficulty?: Difficulty;
}

export interface WordFilters {
  searchQuery: string;
  category: string | null;
  difficulty: Difficulty | null;
  status: LearningStatus | null;
  sortBy: 'word-asc' | 'word-desc' | 'created-desc' | 'created-asc' | 'difficulty';
}
