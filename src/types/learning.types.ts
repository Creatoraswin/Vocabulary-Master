import { LearningStatus, Word } from './word.types';

export interface LearningProgress {
  id: string;
  userId: string;
  wordId: string;
  status: LearningStatus;
  attempts: number;
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt: string;
  updatedAt: string;
}

export interface SaveLearningProgressInput {
  wordId: string;
  status: LearningStatus;
  isRemembered: boolean;
}

export interface LearningSessionWord extends Word {
  progress?: LearningProgress;
  sessionStatus?: 'unseen' | 'remembered' | 'review';
}

export interface LearningSessionSummary {
  totalWords: number;
  rememberedCount: number;
  reviewCount: number;
  accuracyPercentage: number;
  completedAt: string;
}
