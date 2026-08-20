import { useCallback, useState } from 'react';
import { learningService } from '../services/learningService';
import { wordService } from '../services/wordService';
import { useAuth } from './useAuth';
import { selectWordsForSession } from '../utils/learningAlgorithm';
import {
  LearningProgress,
  LearningSessionSummary,
  LearningSessionWord,
} from '../types/learning.types';
import { Word } from '../types/word.types';

export const useLearning = () => {
  const { user } = useAuth();
  const [sessionWords, setSessionWords] = useState<LearningSessionWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isMeaningRevealed, setIsMeaningRevealed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [sessionSummary, setSessionSummary] = useState<LearningSessionSummary | null>(null);

  const startSession = useCallback(
    async (options?: { category?: string; difficulty?: string; sessionSize?: number }) => {
      setIsLoading(true);
      setSessionSummary(null);
      setCurrentIndex(0);
      setIsMeaningRevealed(false);

      try {
        const [allWords, progressList] = await Promise.all([
          wordService.getWords(),
          user?.id ? learningService.getLearningProgress(user.id) : Promise.resolve([]),
        ]);

        const selected = selectWordsForSession(
          allWords,
          progressList,
          options?.sessionSize || 10,
          options?.category,
          options?.difficulty
        );

        setSessionWords(selected);
      } catch (err) {
        console.error('[useLearning] startSession error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id]
  );

  const currentWord: LearningSessionWord | undefined = sessionWords[currentIndex];

  const handleRevealMeaning = useCallback(() => {
    setIsMeaningRevealed(true);
  }, []);

  const handleRecordWordOutcome = useCallback(
    async (isRemembered: boolean) => {
      if (!currentWord || isSaving) return;
      setIsSaving(true);

      const status = isRemembered ? 'REMEMBERED' : 'REVIEW';

      // Update local session word
      const updatedSessionWords = [...sessionWords];
      updatedSessionWords[currentIndex] = {
        ...currentWord,
        sessionStatus: isRemembered ? 'remembered' : 'review',
      };
      setSessionWords(updatedSessionWords);

      // Persist to GraphQL / DynamoDB backend
      try {
        if (user?.id) {
          await learningService.saveLearningProgress(user.id, {
            wordId: currentWord.id,
            status,
            isRemembered,
          });
        }
      } catch (err) {
        console.warn('[useLearning] Save progress error:', err);
      } finally {
        setIsSaving(false);
      }

      // Check if session completed
      if (currentIndex + 1 < sessionWords.length) {
        setCurrentIndex(prev => prev + 1);
        setIsMeaningRevealed(false);
      } else {
        // Complete session
        const rememberedCount = updatedSessionWords.filter(w => w.sessionStatus === 'remembered').length;
        const reviewCount = updatedSessionWords.filter(w => w.sessionStatus === 'review').length;
        const totalWords = updatedSessionWords.length;
        const accuracyPercentage = totalWords > 0 ? Math.round((rememberedCount / totalWords) * 100) : 0;

        const summary: LearningSessionSummary = {
          totalWords,
          rememberedCount,
          reviewCount,
          accuracyPercentage,
          completedAt: new Date().toISOString(),
        };

        setSessionSummary(summary);
      }
    },
    [currentWord, currentIndex, isSaving, sessionWords, user?.id]
  );

  const handleRemember = useCallback(() => {
    handleRecordWordOutcome(true);
  }, [handleRecordWordOutcome]);

  const handleNeedReview = useCallback(() => {
    handleRecordWordOutcome(false);
  }, [handleRecordWordOutcome]);

  return {
    sessionWords,
    currentIndex,
    currentWord,
    isMeaningRevealed,
    isLoading,
    isSaving,
    sessionSummary,
    totalInSession: sessionWords.length,
    progressPercent: sessionWords.length > 0 ? (currentIndex + 1) / sessionWords.length : 0,
    startSession,
    revealMeaning: handleRevealMeaning,
    rememberWord: handleRemember,
    reviewWord: handleNeedReview,
  };
};
