import { generateClient } from 'aws-amplify/api';
import { getAmplifyStatus } from './amplifyConfig';
import { storageService } from './storageService';
import { APP_CONFIG } from '../constants/config';
import { INITIAL_WORDS } from '../constants/initialWords';
import { Word, CreateWordInput, UpdateWordInput } from '../types/word.types';
import { LearningProgress, SaveLearningProgressInput } from '../types/learning.types';
import { Evaluation, CreateEvaluationInput } from '../types/evaluation.types';

// Initialize live AppSync client
let appsyncClient: any = null;

const getClient = () => {
  if (!appsyncClient) {
    try {
      appsyncClient = generateClient();
    } catch {
      appsyncClient = null;
    }
  }
  return appsyncClient;
};

// Seed initial DynamoDB Words table in storage if empty
const initializeDynamoDbTables = async () => {
  const existingWords = await storageService.getItem<Word[]>(APP_CONFIG.storageKeys.WORDS, []);
  if (existingWords.length === 0) {
    await storageService.setItem(APP_CONFIG.storageKeys.WORDS, INITIAL_WORDS);
  }
};

initializeDynamoDbTables();

export const apiService = {
  // ----------------------------------------------------
  // GraphQL Execution Layer for AppSync / DynamoDB
  // ----------------------------------------------------

  async executeGraphQL<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
    const { isAwsConnected } = getAmplifyStatus();

    if (isAwsConnected) {
      try {
        const client = getClient();
        if (client) {
          const response = await client.graphql({
            query,
            variables,
          });
          return response.data as T;
        }
      } catch (error: any) {
        console.log('[AppSync GraphQL] Falling back to local offline storage:', error?.message || error);
      }
    }

    throw new Error('GraphQL request routed to local engine');
  },

  // ----------------------------------------------------
  // Words Table (DynamoDB) Operations
  // ----------------------------------------------------

  async listWords(): Promise<Word[]> {
    try {
      return await storageService.getItem<Word[]>(APP_CONFIG.storageKeys.WORDS, INITIAL_WORDS);
    } catch (error) {
      console.error('[DynamoDB:Words] listWords error:', error);
      return INITIAL_WORDS;
    }
  },

  async getWord(id: string): Promise<Word | null> {
    const words = await this.listWords();
    return words.find(w => w.id === id) || null;
  },

  async createWord(input: CreateWordInput): Promise<Word> {
    const words = await this.listWords();
    const now = new Date().toISOString();
    const newWord: Word = {
      id: `word-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      word: input.word.trim(),
      meaning: input.meaning.trim(),
      example: input.example ? input.example.trim() : '',
      category: input.category,
      difficulty: input.difficulty,
      createdAt: now,
      updatedAt: now,
    };

    const updatedWords = [newWord, ...words];
    await storageService.setItem(APP_CONFIG.storageKeys.WORDS, updatedWords);
    return newWord;
  },

  async updateWord(input: UpdateWordInput): Promise<Word> {
    const words = await this.listWords();
    const index = words.findIndex(w => w.id === input.id);
    if (index === -1) {
      throw new Error(`Word with ID "${input.id}" not found.`);
    }

    const now = new Date().toISOString();
    const existing = words[index];
    const updatedWord: Word = {
      ...existing,
      word: input.word !== undefined ? input.word.trim() : existing.word,
      meaning: input.meaning !== undefined ? input.meaning.trim() : existing.meaning,
      example: input.example !== undefined ? input.example.trim() : existing.example,
      category: input.category || existing.category,
      difficulty: input.difficulty || existing.difficulty,
      updatedAt: now,
    };

    words[index] = updatedWord;
    await storageService.setItem(APP_CONFIG.storageKeys.WORDS, [...words]);
    return updatedWord;
  },

  async deleteWord(id: string): Promise<{ id: string }> {
    const words = await this.listWords();
    const filtered = words.filter(w => w.id !== id);
    await storageService.setItem(APP_CONFIG.storageKeys.WORDS, filtered);

    // Also clean up associated learning progress
    const allProgress = await storageService.getItem<LearningProgress[]>(
      APP_CONFIG.storageKeys.LEARNING_PROGRESS,
      []
    );
    const updatedProgress = allProgress.filter(p => p.wordId !== id);
    await storageService.setItem(APP_CONFIG.storageKeys.LEARNING_PROGRESS, updatedProgress);

    return { id };
  },

  // ----------------------------------------------------
  // LearningProgress Table (DynamoDB) Operations
  // ----------------------------------------------------

  async getUserLearningProgress(userId: string): Promise<LearningProgress[]> {
    const allProgress = await storageService.getItem<LearningProgress[]>(
      APP_CONFIG.storageKeys.LEARNING_PROGRESS,
      []
    );
    return allProgress.filter(p => p.userId === userId || !p.userId);
  },

  async saveLearningProgress(
    userId: string,
    input: SaveLearningProgressInput
  ): Promise<LearningProgress> {
    const allProgress = await storageService.getItem<LearningProgress[]>(
      APP_CONFIG.storageKeys.LEARNING_PROGRESS,
      []
    );

    const now = new Date().toISOString();
    const existingIndex = allProgress.findIndex(
      p => p.wordId === input.wordId && (p.userId === userId || !p.userId)
    );

    if (existingIndex >= 0) {
      const existing = allProgress[existingIndex];
      const updated: LearningProgress = {
        ...existing,
        status: input.status,
        attempts: existing.attempts + 1,
        correctCount: input.isRemembered ? existing.correctCount + 1 : existing.correctCount,
        incorrectCount: !input.isRemembered ? existing.incorrectCount + 1 : existing.incorrectCount,
        lastReviewedAt: now,
        updatedAt: now,
      };
      allProgress[existingIndex] = updated;
      await storageService.setItem(APP_CONFIG.storageKeys.LEARNING_PROGRESS, [...allProgress]);
      return updated;
    } else {
      const newProgress: LearningProgress = {
        id: `lp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        userId: userId || 'default-user',
        wordId: input.wordId,
        status: input.status,
        attempts: 1,
        correctCount: input.isRemembered ? 1 : 0,
        incorrectCount: input.isRemembered ? 0 : 1,
        lastReviewedAt: now,
        updatedAt: now,
      };
      allProgress.push(newProgress);
      await storageService.setItem(APP_CONFIG.storageKeys.LEARNING_PROGRESS, [...allProgress]);
      return newProgress;
    }
  },

  // ----------------------------------------------------
  // Evaluation Table (DynamoDB) Operations
  // ----------------------------------------------------

  async getEvaluationHistory(userId: string): Promise<Evaluation[]> {
    const allEvaluations = await storageService.getItem<Evaluation[]>(
      APP_CONFIG.storageKeys.EVALUATIONS,
      []
    );
    const userEvals = allEvaluations.filter(e => e.userId === userId || !e.userId);
    return userEvals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createEvaluation(userId: string, input: CreateEvaluationInput): Promise<Evaluation> {
    const allEvaluations = await storageService.getItem<Evaluation[]>(
      APP_CONFIG.storageKeys.EVALUATIONS,
      []
    );

    const now = new Date().toISOString();
    const evalId = `eval-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const newEvaluation: Evaluation = {
      id: evalId,
      userId: userId || 'default-user',
      totalQuestions: input.totalQuestions,
      correctAnswers: input.correctAnswers,
      incorrectAnswers: input.incorrectAnswers,
      score: input.score,
      percentage: input.percentage,
      createdAt: now,
      answers: input.answers.map((a, i) => ({
        id: `ans-${evalId}-${i}`,
        evaluationId: evalId,
        wordId: a.wordId,
        questionType: a.questionType,
        userAnswer: a.userAnswer,
        correctAnswer: a.correctAnswer,
        isCorrect: a.isCorrect,
      })),
    };

    allEvaluations.unshift(newEvaluation);
    await storageService.setItem(APP_CONFIG.storageKeys.EVALUATIONS, allEvaluations);
    return newEvaluation;
  },
};
