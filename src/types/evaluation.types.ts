import { Difficulty } from './word.types';

export type QuestionType = 'WORD_TO_MEANING' | 'MEANING_TO_WORD';

export interface EvaluationQuestion {
  id: string;
  wordId: string;
  questionType: QuestionType;
  prompt: string;
  subPrompt?: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface EvaluationAnswer {
  id: string;
  evaluationId: string;
  wordId: string;
  questionType: QuestionType;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface Evaluation {
  id: string;
  userId: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  percentage: number;
  createdAt: string;
  answers?: EvaluationAnswer[];
}

export interface CreateEvaluationInput {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  percentage: number;
  answers: Array<{
    wordId: string;
    questionType: QuestionType;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

export interface EvaluationSetupOptions {
  questionCount: number;
  difficulty: Difficulty | 'ALL';
  category: string | 'ALL';
}
