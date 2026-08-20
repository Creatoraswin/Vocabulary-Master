import { useCallback, useEffect, useState } from 'react';
import { evaluationService } from '../services/evaluationService';
import { wordService } from '../services/wordService';
import { useAuth } from './useAuth';
import { generateEvaluationQuestions } from '../utils/evaluationAlgorithm';
import {
  CreateEvaluationInput,
  Evaluation,
  EvaluationQuestion,
  EvaluationSetupOptions,
} from '../types/evaluation.types';

export const useEvaluation = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<EvaluationQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<Evaluation | null>(null);
  const [history, setHistory] = useState<Evaluation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  const fetchHistory = useCallback(async () => {
    if (!user?.id) return;
    setIsLoadingHistory(true);
    try {
      const records = await evaluationService.getEvaluationHistory(user.id);
      setHistory(records);
    } catch (err) {
      console.warn('[useEvaluation] Fetch history error:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const startQuiz = useCallback(
    async (options: EvaluationSetupOptions) => {
      setIsLoading(true);
      setLastResult(null);
      setCurrentIndex(0);
      setSelectedAnswers({});

      try {
        const allWords = await wordService.getWords();
        const generatedQuestions = generateEvaluationQuestions(allWords, options);
        setQuestions(generatedQuestions);
      } catch (err) {
        console.error('[useEvaluation] Start quiz error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSelectOption = useCallback((option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: option,
    }));
  }, [currentIndex]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const submitQuiz = useCallback(async (): Promise<Evaluation> => {
    setIsSubmitting(true);

    try {
      let correctCount = 0;
      const answerPayloads = questions.map((q, index) => {
        const userAnswer = selectedAnswers[index] || '';
        const isCorrect = userAnswer.trim() === q.correctAnswer.trim();
        if (isCorrect) correctCount += 1;

        return {
          wordId: q.wordId,
          questionType: q.questionType,
          userAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect,
        };
      });

      const totalQuestions = questions.length;
      const incorrectCount = totalQuestions - correctCount;
      const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      const score = correctCount * 10;

      const input: CreateEvaluationInput = {
        totalQuestions,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        score,
        percentage,
        answers: answerPayloads,
      };

      const savedEvaluation = await evaluationService.createEvaluation(
        user?.id || 'default-user',
        input
      );

      setLastResult(savedEvaluation);
      setHistory(prev => [savedEvaluation, ...prev]);
      return savedEvaluation;
    } finally {
      setIsSubmitting(false);
    }
  }, [questions, selectedAnswers, user?.id]);

  const currentQuestion: EvaluationQuestion | undefined = questions[currentIndex];
  const currentSelectedOption: string | null = selectedAnswers[currentIndex] || null;

  return {
    questions,
    currentIndex,
    currentQuestion,
    currentSelectedOption,
    selectedAnswers,
    isLoading,
    isSubmitting,
    lastResult,
    history,
    isLoadingHistory,
    totalQuestions: questions.length,
    progressPercent: questions.length > 0 ? (currentIndex + 1) / questions.length : 0,
    isLastQuestion: currentIndex === questions.length - 1,
    startQuiz,
    selectOption: handleSelectOption,
    nextQuestion: handleNextQuestion,
    previousQuestion: handlePreviousQuestion,
    submitQuiz,
    refreshHistory: fetchHistory,
  };
};
